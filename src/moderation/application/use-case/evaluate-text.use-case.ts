import { createHash } from 'crypto';
import { decide } from '../../domain/model/decision-policy';
import { Classification, ClassifierFailure, ReviewText, Verdict } from '../../domain/model/moderation';
import { LocalRules } from '../../domain/port/local-rules.port';
import { ModerationLog } from '../../domain/port/moderation-log.port';
import { ModerationPort } from '../../domain/port/moderation.port';
import { ClassifierResult, TextClassifier } from '../../domain/port/text-classifier.port';

/**
 * Modera el texto de una reseña según la política (sección 5): reglas locales, clasificador (si las reglas no
 * rechazaron y queda presupuesto) y tabla de decisión. Registra cada decisión con la huella del texto.
 */
export class EvaluateTextUseCase extends ModerationPort {
    constructor(
        private readonly rules: LocalRules,
        private readonly classifier: TextClassifier,
        private readonly log: ModerationLog,
        private readonly monthlyBudgetUsd: number,
    ) {
        super();
    }

    async evaluate(text: ReviewText, context: { reviewId?: number } = {}): Promise<Verdict> {
        const joined = `Lo bueno: ${text.loBueno.trim()}\nA mejorar: ${text.aMejorar.trim()}`;
        const rules = this.rules.check(joined);

        // El clasificador se consulta solo si las reglas no rechazaron y queda presupuesto en el mes.
        let classification: Classification | null = null;
        let failure: ClassifierFailure | null = null;
        let costUsd = 0;
        if (!rules.includes('datos_contacto')) {
            const result: ClassifierResult = (await this.log.monthSpendUsd()) >= this.monthlyBudgetUsd
                ? { ok: false, failure: 'tope_de_gasto', costUsd: 0 }
                : await this.classifier.classify(joined);
            if (result.ok === true) {
                classification = result.classification;
                costUsd = classification.costUsd;
            } else {
                const failed = result as Extract<ClassifierResult, { ok: false }>;
                failure = failed.failure;
                costUsd = failed.costUsd;
            }
        }

        const decision = decide({ rules, scores: classification?.scores ?? null, failure });
        const verdict: Verdict = {
            ...decision,
            rules,
            scores: classification?.scores ?? null,
            failure,
            model: classification?.model ?? null,
            promptVersion: classification?.promptVersion ?? null,
            modelReason: classification?.reason || null,
            costUsd,
        };

        if (costUsd > 0) await this.log.addSpend(costUsd);
        await this.log.record(verdict, createHash('sha256').update(joined).digest('hex'), context.reviewId ?? null);
        return verdict;
    }
}
