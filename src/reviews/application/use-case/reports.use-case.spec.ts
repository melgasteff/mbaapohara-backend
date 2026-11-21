import { HumanDecision, ModerationCategory, ReviewText } from 'src/moderation/domain/model/moderation';
import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { ReportCategory, ReportStatus } from '../../domain/model/report';
import { ReviewStatus } from '../../domain/model/review';
import { ReportRepository } from '../../domain/port/report-repository.port';
import { ReviewRepository, VersionDecision } from '../../domain/port/review-repository.port';
import {
    InvalidReviewException, NoPendingReportsException, ReviewNotFoundException, ReviewNotPublishedException,
} from '../exception/review.exceptions';
import { KeepReportedReviewUseCase, ReportReviewUseCase, RetireReviewUseCase } from './reports.use-case';

/** Reseña 1 publicada (de la cuenta 7); reseña 2 sin publicar. */
function reviews() {
    const retired: { reviewId: number; decision: VersionDecision }[] = [];
    let published = true;
    return {
        retired,
        async findPublic(id: number) { return id === 1 && published ? ({ id: 1 } as never) : null; },
        async findOwned(id: number, userId: number) { return id === 1 && userId === 7 ? ({ id: 1, lastStatus: ReviewStatus.Published }) : null; },
        async retirePublished(reviewId: number, decision: VersionDecision) {
            if (reviewId !== 1 || !published) return null;
            published = false;
            retired.push({ reviewId, decision });
            return { versionId: 11, loBueno: 'Lo bueno', aMejorar: 'A mejorar' };
        },
    } as unknown as ReviewRepository & { retired: { reviewId: number; decision: VersionDecision }[] };
}

class MemoryReports extends ReportRepository {
    created: { reviewId: number; userId: number; category: ReportCategory; comment: string | null }[] = [];
    pending = 0;
    resolved: { reviewId: number; status: ReportStatus; adminId: number }[] = [];
    async create(reviewId: number, userId: number, category: ReportCategory, comment: string | null) { this.created.push({ reviewId, userId, category, comment }); this.pending++; }
    async listPending() { return { data: [], total: 0, page: 1, pageSize: 20 }; }
    async resolvePending(reviewId: number, status: ReportStatus.Kept | ReportStatus.Retired, adminId: number) {
        const closed = this.pending;
        this.pending = 0;
        if (closed) this.resolved.push({ reviewId, status, adminId });
        return closed;
    }
}

class FakeModeration extends ModerationPort {
    human: { text: ReviewText; decision: HumanDecision }[] = [];
    evaluate(): never { throw new Error('no se usa'); }
    async recordHumanDecision(text: ReviewText, decision: HumanDecision) { this.human.push({ text, decision }); }
    async signalsFor() { return []; }
}

describe('Reportes', () => {
    it('una cuenta reporta una reseña publicada ajena; «Otro» exige comentario', async () => {
        const reports = new MemoryReports();
        const useCase = new ReportReviewUseCase(reviews(), reports);
        await useCase.execute(8, 1, ModerationCategory.TER, '  nombra   al encargado ');
        expect(reports.created).toEqual([{ reviewId: 1, userId: 8, category: 'TER', comment: 'nombra al encargado' }]);
        await expect(useCase.execute(8, 1, 'OTRO', '   ')).rejects.toThrow(/por qué/);
        await expect(useCase.execute(7, 1, ModerationCategory.TER, null)).rejects.toThrow(InvalidReviewException);
        await expect(useCase.execute(8, 2, ModerationCategory.TER, null)).rejects.toThrow(ReviewNotFoundException);
    });

    it('mantener cierra los reportes; sin reportes pendientes responde «no hay»', async () => {
        const reports = new MemoryReports();
        await new ReportReviewUseCase(reviews(), reports).execute(8, 1, ModerationCategory.SPAM, null);
        const keep = new KeepReportedReviewUseCase(reports);
        expect(await keep.execute(1, 1)).toEqual({ reportesCerrados: 1 });
        expect(reports.resolved[0]).toEqual({ reviewId: 1, status: ReportStatus.Kept, adminId: 1 });
        await expect(keep.execute(1, 1)).rejects.toThrow(NoPendingReportsException);
    });

    it('retirar rechaza la versión publicada, cierra los reportes y registra la decisión', async () => {
        const repo = reviews();
        const reports = new MemoryReports();
        const moderation = new FakeModeration();
        await new ReportReviewUseCase(repo, reports).execute(8, 1, ModerationCategory.ACU, null);
        const result = await new RetireReviewUseCase(repo, reports, moderation).execute(3, 1, ModerationCategory.ACU, 'Contá el hecho sobre la empresa, sin nombrar a nadie.');
        expect(result).toEqual({ idResena: 1, reportesCerrados: 1 });
        expect(repo.retired[0].decision).toEqual({ status: ReviewStatus.Rejected, category: 'ACU', message: 'Contá el hecho sobre la empresa, sin nombrar a nadie.' });
        expect(moderation.human[0]).toMatchObject({ text: { loBueno: 'Lo bueno' }, decision: { category: 'ACU', adminId: 3 } });
        await expect(new RetireReviewUseCase(repo, reports, moderation).execute(3, 1, ModerationCategory.ACU, 'Motivo suficientemente largo.'))
            .rejects.toThrow(ReviewNotPublishedException);
        await expect(new RetireReviewUseCase(repo, reports, moderation).execute(3, 1, ModerationCategory.ACU, 'corto')).rejects.toThrow(InvalidReviewException);
    });
});
