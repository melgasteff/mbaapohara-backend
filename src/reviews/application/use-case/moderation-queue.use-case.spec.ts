import { AutomaticSignals, HumanDecision, ModerationCategory, ModerationOutcome, ReviewText } from 'src/moderation/domain/model/moderation';
import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { Page } from 'src/shared/domain/page';
import { ReviewStatus, WorkSituation } from '../../domain/model/review';
import { QueueVersion, VersionToDecide } from '../../domain/model/review-views';
import { ReviewRepository, VersionDecision } from '../../domain/port/review-repository.port';
import { InvalidReviewException, VersionAlreadyDecidedException, VersionNotFoundException } from '../exception/review.exceptions';
import { DecideReviewUseCase, ListModerationQueueUseCase } from './moderation-queue.use-case';

const queued = (idVersion: number, fechaEnvio: Date): QueueVersion => ({
    idVersion, idResena: idVersion * 10, numero: 1, empresa: { id: 1, nombre: 'Empresa' }, local: { id: 1, nombre: 'Local', ciudad: 'Asunción' },
    cargo: { descripcion: 'Cajera', aprobado: true }, situacion: WorkSituation.Current, ultimoAnio: null,
    tipoContrato: { id: 1, nombre: 'Indefinido' }, modalidad: { id: 1, nombre: 'Presencial' }, calificacion: 3,
    loBueno: 'bueno', aMejorar: 'mejorar', respuestas: [], fechaEnvio, tieneVersionPublicada: false,
});


/** Repositorio con solo lo que usan la cola y la decisión. */
function repo(versions: VersionToDecide[], queue: QueueVersion[] = []) {
    const decisions: { reviewId: number; versionId: number; decision: VersionDecision }[] = [];
    const fake = {
        decisions,
        async listQueue(): Promise<Page<QueueVersion>> { return { data: queue, total: queue.length, page: 1, pageSize: 20 }; },
        async findVersion(id: number) { return versions.find(v => v.idVersion === id) ?? null; },
        async decideInReview(reviewId: number, versionId: number, decision: VersionDecision) {
            const version = versions.find(v => v.idVersion === versionId)!;
            if (version.estado !== ReviewStatus.InReview) return false;
            version.estado = decision.status;
            decisions.push({ reviewId, versionId, decision });
            return true;
        },
    };
    return fake as unknown as ReviewRepository & { decisions: typeof decisions };
}

class FakeModeration extends ModerationPort {
    human: { text: ReviewText; decision: HumanDecision; context: { reviewId: number; versionId: number } }[] = [];
    constructor(private readonly signals: AutomaticSignals[] = []) { super(); }
    evaluate(): never { throw new Error('no se usa'); }
    async recordHumanDecision(text: ReviewText, decision: HumanDecision, context: { reviewId: number; versionId: number }) { this.human.push({ text, decision, context }); }
    async signalsFor(ids: number[]) { return this.signals.filter(s => ids.includes(s.versionId)); }
}

const inReview = (): VersionToDecide => ({ idVersion: 5, idResena: 50, estado: ReviewStatus.InReview, loBueno: 'Lo bueno', aMejorar: 'A mejorar' });

describe('Revisión humana', () => {
    it('la cola suma las señales automáticas y las horas de espera', async () => {
        const signal: AutomaticSignals = { versionId: 1, category: ModerationCategory.ACU, rules: [], scores: null, failure: null, modelReason: 'posible acusación' };
        const now = new Date('2026-11-21T12:00:00Z');
        const page = await new ListModerationQueueUseCase(
            repo([], [queued(1, new Date('2026-11-19T11:30:00Z')), queued(2, now)]), new FakeModeration([signal]), () => now,
        ).execute({ page: 1, pageSize: 20 });
        expect(page.data[0]).toMatchObject({ idVersion: 1, horasEsperando: 48, senales: { category: 'ACU', modelReason: 'posible acusación' } });
        expect(page.data[1]).toMatchObject({ idVersion: 2, horasEsperando: 0, senales: null });
    });

    it('publicar aplica la decisión y la registra con el administrador y el texto revisado', async () => {
        const reviews = repo([inReview()]);
        const moderation = new FakeModeration();
        const result = await new DecideReviewUseCase(reviews, moderation).publish(9, 5);
        expect(result).toEqual({ idResena: 50, estado: ReviewStatus.Published });
        expect(reviews.decisions[0]).toMatchObject({ reviewId: 50, versionId: 5, decision: { status: ReviewStatus.Published, category: null } });
        expect(moderation.human[0]).toMatchObject({
            text: { loBueno: 'Lo bueno', aMejorar: 'A mejorar' },
            decision: { outcome: ModerationOutcome.Published, adminId: 9 },
            context: { reviewId: 50, versionId: 5 },
        });
    });

    it('rechazar guarda la categoría y el motivo normalizado; exige de 10 a 500 caracteres', async () => {
        const reviews = repo([inReview()]);
        const useCase = new DecideReviewUseCase(reviews, new FakeModeration());
        await expect(useCase.reject(9, 5, ModerationCategory.TER, '  corto ')).rejects.toThrow(InvalidReviewException);
        await useCase.reject(9, 5, ModerationCategory.TER, '  Contá lo que pasó   sin decir quién fue.  ');
        expect(reviews.decisions[0].decision).toEqual({ status: ReviewStatus.Rejected, category: 'TER', message: 'Contá lo que pasó sin decir quién fue.' });
    });

    it('una versión que no existe o que ya se decidió no se vuelve a decidir ni se registra', async () => {
        const moderation = new FakeModeration();
        const useCase = new DecideReviewUseCase(repo([{ ...inReview(), estado: ReviewStatus.Published }]), moderation);
        await expect(useCase.publish(9, 99)).rejects.toThrow(VersionNotFoundException);
        await expect(useCase.publish(9, 5)).rejects.toThrow(VersionAlreadyDecidedException);
        expect(moderation.human).toHaveLength(0);
    });
});
