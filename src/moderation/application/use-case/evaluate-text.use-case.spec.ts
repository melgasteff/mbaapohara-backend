import { AutomaticSignals, CategoryScores, HumanDecision, ModerationOutcome as O, RuleSignal, Verdict } from '../../domain/model/moderation';
import { LocalRules } from '../../domain/port/local-rules.port';
import { ModerationLog } from '../../domain/port/moderation-log.port';
import { ClassifierResult, TextClassifier } from '../../domain/port/text-classifier.port';
import { EvaluateTextUseCase } from './evaluate-text.use-case';

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };

class FakeRules extends LocalRules {
    constructor(private readonly signals: RuleSignal[] = []) { super(); }
    check(): RuleSignal[] { return this.signals; }
}
class FakeClassifier extends TextClassifier {
    calls: string[] = [];
    constructor(private readonly result: ClassifierResult) { super(); }
    async classify(text: string): Promise<ClassifierResult> { this.calls.push(text); return this.result; }
}
class MemoryLog extends ModerationLog {
    records: { verdict: Verdict; hash: string; reviewId: number | null }[] = [];
    spent = 0;
    async record(verdict: Verdict, hash: string, reviewId: number | null) { this.records.push({ verdict, hash, reviewId }); }
    async monthSpendUsd() { return this.spent; }
    async addSpend(cost: number) { this.spent += cost; }
    human: { decision: HumanDecision; hash: string; reviewId: number; versionId: number }[] = [];
    async recordHuman(decision: HumanDecision, hash: string, reviewId: number, versionId: number) { this.human.push({ decision, hash, reviewId, versionId }); }
    async signalsFor(): Promise<AutomaticSignals[]> { return []; }
}
const ok = (scores: Partial<CategoryScores>, costUsd = 0.0003): ClassifierResult => ({
    ok: true, classification: { scores: { ...zero, ...scores }, provider: 'prueba', model: 'modelo-prueba', promptVersion: 'v-prueba', costUsd, reason: 'motivo' },
});
const text = { loBueno: 'Pagan en fecha y el ambiente es bueno.', aMejorar: 'Las horas extra se pagan tarde.' };

describe('EvaluateTextUseCase', () => {
    it('publica, suma el costo al mes y registra la huella del texto, nunca el texto', async () => {
        const log = new MemoryLog();
        const verdict = await new EvaluateTextUseCase(new FakeRules(), new FakeClassifier(ok({})), log, 5).evaluate(text, { reviewId: 7 });
        expect(verdict).toMatchObject({ outcome: O.Published, model: 'modelo-prueba', modelReason: 'motivo', costUsd: 0.0003 });
        expect(log.spent).toBeCloseTo(0.0003);
        expect(log.records[0].hash).toMatch(/^[0-9a-f]{64}$/);
        expect(log.records[0].reviewId).toBe(7);
        expect(JSON.stringify(log.records)).not.toContain('horas extra');
    });

    it('con una regla de datos de contacto rechaza sin consultar el modelo (sin costo)', async () => {
        const classifier = new FakeClassifier(ok({}));
        const log = new MemoryLog();
        const verdict = await new EvaluateTextUseCase(new FakeRules(['datos_contacto']), classifier, log, 5).evaluate(text);
        expect(verdict).toMatchObject({ outcome: O.Rejected, category: 'DP', costUsd: 0 });
        expect(classifier.calls).toHaveLength(0);
    });

    it('al alcanzar el tope de gasto no consulta el modelo y manda a revisión', async () => {
        const classifier = new FakeClassifier(ok({}));
        const log = new MemoryLog();
        log.spent = 5;
        const verdict = await new EvaluateTextUseCase(new FakeRules(), classifier, log, 5).evaluate(text);
        expect(verdict).toMatchObject({ outcome: O.InReview, failure: 'tope_de_gasto' });
        expect(classifier.calls).toHaveLength(0);
    });

    it('si el modelo falla manda a revisión y cobra lo que se haya gastado', async () => {
        const log = new MemoryLog();
        const verdict = await new EvaluateTextUseCase(new FakeRules(), new FakeClassifier({ ok: false, failure: 'rechazo_del_modelo', costUsd: 0.0001 }), log, 5).evaluate(text);
        expect(verdict).toMatchObject({ outcome: O.InReview, failure: 'rechazo_del_modelo', scores: null });
        expect(log.spent).toBeCloseTo(0.0001);
    });

    it('envía al clasificador los dos campos juntos y nada más', async () => {
        const classifier = new FakeClassifier(ok({}));
        await new EvaluateTextUseCase(new FakeRules(), classifier, new MemoryLog(), 5).evaluate(text);
        expect(classifier.calls[0]).toBe('Lo bueno: Pagan en fecha y el ambiente es bueno.\nA mejorar: Las horas extra se pagan tarde.');
    });

    it('registra la decisión humana con la misma huella del texto que la automática', async () => {
        const log = new MemoryLog();
        const useCase = new EvaluateTextUseCase(new FakeRules(), new FakeClassifier(ok({})), log, 5);
        await useCase.evaluate(text, { reviewId: 3, versionId: 4 });
        const decision: HumanDecision = { outcome: O.Published, category: null, message: 'ok', adminId: 1 };
        await useCase.recordHumanDecision(text, decision, { reviewId: 3, versionId: 4 });
        expect(log.human).toEqual([{ decision, hash: log.records[0].hash, reviewId: 3, versionId: 4 }]);
    });
});
