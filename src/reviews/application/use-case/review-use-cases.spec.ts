import { ModerationCategory, ModerationOutcome, ReviewText, Verdict } from 'src/moderation/domain/model/moderation';
import { ModerationContext, ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { Page } from 'src/shared/domain/page';
import { ActiveCriterion, CriterionAnswer, ReviewContent, ReviewInput, ReviewStatus, WorkSituation } from '../../domain/model/review';
import { MyReview, OwnedReview, PublicReview, QueueVersion, VersionToDecide } from '../../domain/model/review-views';
import { ReviewReferences } from '../../domain/port/review-references.port';
import { ReviewRepository, VersionDecision } from '../../domain/port/review-repository.port';
import { InvalidReviewException, ReviewAlreadyExistsException, ReviewInReviewException, ReviewNotFoundException } from '../exception/review.exceptions';
import { DeleteReviewUseCase } from './delete-review.use-case';
import { EditReviewUseCase } from './edit-review.use-case';
import { PublishReviewUseCase } from './publish-review.use-case';

const TEXT = 'Pagan en fecha y el ambiente es bueno, con contrato firmado desde el inicio.';
const NOW = () => new Date('2026-11-21T12:00:00Z');

class FakeRefs extends ReviewReferences {
    openOffices = new Set([1]);
    async isOfficeOpen(id: number) { return this.openOffices.has(id); }
    async isJobAvailable(id: number) { return id === 1; }
    async contractTypeExists(id: number) { return id === 1; }
    async workModeExists(id: number) { return id === 1; }
    async activeCriteria(): Promise<ActiveCriterion[]> { return [{ id: 10, code: 'CP01' }]; }
}

/** Repositorio en memoria: versiones por reseña y la versión publicada. */
class MemoryRepo extends ReviewRepository {
    reviews = new Map<number, { userId: number; officeId: number; versions: { id: number; status: ReviewStatus; content: ReviewContent }[]; publishedVersion: number | null }>();
    private nextId = 1;
    async create(userId: number, officeId: number, content: ReviewContent) {
        if ([...this.reviews.values()].some(r => r.userId === userId && r.officeId === officeId)) throw new ReviewAlreadyExistsException();
        const reviewId = this.nextId++;
        const versionId = this.nextId++;
        this.reviews.set(reviewId, { userId, officeId, versions: [{ id: versionId, status: ReviewStatus.InReview, content }], publishedVersion: null });
        return { reviewId, versionId };
    }
    async addVersion(reviewId: number, content: ReviewContent) {
        const versionId = this.nextId++;
        this.reviews.get(reviewId)!.versions.push({ id: versionId, status: ReviewStatus.InReview, content });
        return { versionId };
    }
    async applyDecision(reviewId: number, versionId: number, decision: VersionDecision) {
        const review = this.reviews.get(reviewId)!;
        review.versions.find(v => v.id === versionId)!.status = decision.status;
        if (decision.status === ReviewStatus.Published) review.publishedVersion = versionId;
    }
    async findOwned(reviewId: number, userId: number): Promise<OwnedReview | null> {
        const review = this.reviews.get(reviewId);
        if (!review || review.userId !== userId) return null;
        return { id: reviewId, lastStatus: review.versions[review.versions.length - 1].status };
    }
    async delete(reviewId: number) { this.reviews.delete(reviewId); }
    async listMine(): Promise<MyReview[]> { return []; }
    async listPublic(): Promise<Page<PublicReview>> { return { data: [], total: 0, page: 1, pageSize: 20 }; }
    async findPublic(): Promise<PublicReview | null> { return null; }
    // La cola y la decisión humana se prueban en moderation-queue.use-case.spec.ts.
    async listQueue(): Promise<Page<QueueVersion>> { return { data: [], total: 0, page: 1, pageSize: 20 }; }
    async findVersion(): Promise<VersionToDecide | null> { return null; }
    async decideInReview() { return false; }
    async retirePublished() { return null; }
}

class FakeModeration extends ModerationPort {
    calls: { text: ReviewText; context?: ModerationContext }[] = [];
    constructor(public outcome: ModerationOutcome = ModerationOutcome.Published, public category: ModerationCategory | null = null) { super(); }
    async evaluate(text: ReviewText, context?: ModerationContext): Promise<Verdict> {
        this.calls.push({ text, context });
        return {
            outcome: this.outcome, category: this.category, message: `mensaje ${this.outcome}`, origin: 'modelo', rules: [],
            scores: null, failure: null, model: null, promptVersion: null, modelReason: null, costUsd: 0,
        };
    }
    async recordHumanDecision() { }
    async signalsFor() { return []; }
}

const input = (overrides: Partial<ReviewInput> = {}): ReviewInput => ({
    job: { id: 1 }, situation: WorkSituation.Current, lastYear: null, contractTypeId: 1, workModeId: 1, rating: 4,
    loBueno: TEXT, aMejorar: TEXT, answers: { CP01: CriterionAnswer.Yes }, ...overrides,
});

describe('Casos de uso de reseñas', () => {
    let repo: MemoryRepo;
    let refs: FakeRefs;
    let moderation: FakeModeration;
    const publish = () => new PublishReviewUseCase(repo, refs, moderation, NOW);
    const edit = () => new EditReviewUseCase(repo, refs, moderation, NOW);

    beforeEach(() => {
        repo = new MemoryRepo();
        refs = new FakeRefs();
        moderation = new FakeModeration();
    });

    it('publica: guarda, modera con la reseña y la versión, y la deja visible', async () => {
        const result = await publish().execute(7, 1, input());
        expect(result).toEqual({ id: 1, estado: ReviewStatus.Published, categoria: null, motivo: null });
        expect(moderation.calls[0]).toEqual({ text: { loBueno: TEXT, aMejorar: TEXT }, context: { reviewId: 1, versionId: 2 } });
        expect(repo.reviews.get(1)!.publishedVersion).toBe(2);
    });

    it('rechazada: devuelve la categoría y el motivo, y no queda visible', async () => {
        moderation = new FakeModeration(ModerationOutcome.Rejected, ModerationCategory.DP);
        const result = await publish().execute(7, 1, input());
        expect(result).toMatchObject({ estado: ReviewStatus.Rejected, categoria: 'DP', motivo: 'mensaje rechazada' });
        expect(repo.reviews.get(1)!.publishedVersion).toBeNull();
    });

    it('no guarda nada si el local no está abierto o el contenido no es válido', async () => {
        await expect(publish().execute(7, 99, input())).rejects.toThrow(InvalidReviewException);
        await expect(publish().execute(7, 1, input({ answers: {}, contractTypeId: 5 }))).rejects.toThrow(/CP01.*tipo de contrato/);
        expect(repo.reviews.size).toBe(0);
        expect(moderation.calls).toHaveLength(0);
    });

    it('una reseña por persona y local', async () => {
        await publish().execute(7, 1, input());
        await expect(publish().execute(7, 1, input())).rejects.toThrow(ReviewAlreadyExistsException);
    });

    it('editar: si la versión nueva se rechaza, sigue visible la anterior', async () => {
        await publish().execute(7, 1, input());
        moderation.outcome = ModerationOutcome.Rejected;
        const result = await edit().execute(7, 1, input({ rating: 2 }));
        expect(result.estado).toBe(ReviewStatus.Rejected);
        expect(repo.reviews.get(1)!.publishedVersion).toBe(2);
        moderation.outcome = ModerationOutcome.Published;
        await edit().execute(7, 1, input({ rating: 3 }));
        expect(repo.reviews.get(1)!.publishedVersion).toBe(4);
    });

    it('editar: bloqueado mientras la última versión está en revisión', async () => {
        moderation.outcome = ModerationOutcome.InReview;
        await publish().execute(7, 1, input());
        await expect(edit().execute(7, 1, input())).rejects.toThrow(ReviewInReviewException);
    });

    it('editar o borrar la reseña de otra persona responde «no existe»', async () => {
        await publish().execute(7, 1, input());
        await expect(edit().execute(8, 1, input())).rejects.toThrow(ReviewNotFoundException);
        await expect(new DeleteReviewUseCase(repo).execute(8, 1)).rejects.toThrow(ReviewNotFoundException);
        await new DeleteReviewUseCase(repo).execute(7, 1);
        expect(repo.reviews.size).toBe(0);
    });
});
