import { ModerationCategory, ModerationOutcome } from 'src/moderation/domain/model/moderation';
import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { Page, PageRequest } from 'src/shared/domain/page';
import { ReportCategory, ReportedReview, reportProblem, ReportStatus } from '../../domain/model/report';
import { ReviewStatus } from '../../domain/model/review';
import { ReportRepository } from '../../domain/port/report-repository.port';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import {
    InvalidReviewException, NoPendingReportsException, ReviewNotFoundException, ReviewNotPublishedException,
} from '../exception/review.exceptions';
import { normalizeReason } from './moderation-queue.use-case';

/**
 * Reportar una reseña publicada (política, sección 8). La reseña sigue visible mientras se decide, para que nadie
 * pueda bajar reseñas negativas reportándolas muchas veces.
 */
export class ReportReviewUseCase {
    constructor(private readonly reviews: ReviewRepository, private readonly reports: ReportRepository) { }

    async execute(userId: number, reviewId: number, category: ReportCategory, comment: string | null): Promise<void> {
        if (!(await this.reviews.findPublic(reviewId))) throw new ReviewNotFoundException(reviewId);
        if (await this.reviews.findOwned(reviewId, userId)) throw new InvalidReviewException(['No podés reportar tu propia reseña']);
        const text = comment?.trim().replace(/\s+/g, ' ') || null;
        const problem = reportProblem(category, text);
        if (problem) throw new InvalidReviewException([problem]);
        await this.reports.create(reviewId, userId, category, text);
    }
}

export class ListReportsUseCase {
    constructor(private readonly reports: ReportRepository) { }

    execute(page: PageRequest): Promise<Page<ReportedReview>> {
        return this.reports.listPending(page);
    }
}

/** Mantener una reseña reportada: cierra sus reportes pendientes. */
export class KeepReportedReviewUseCase {
    constructor(private readonly reports: ReportRepository) { }

    async execute(adminId: number, reviewId: number): Promise<{ reportesCerrados: number }> {
        const closed = await this.reports.resolvePending(reviewId, ReportStatus.Kept, adminId);
        if (!closed) throw new NoPendingReportsException(reviewId);
        return { reportesCerrados: closed };
    }
}

/**
 * Retirar una reseña publicada que incumple las reglas (por un reporte o una solicitud de empresa; nunca por ser
 * negativa). La versión publicada pasa a rechazada con la categoría y el motivo, que lee quien escribió; puede
 * editarla. Cierra los reportes pendientes y queda en el registro con origen «persona».
 */
export class RetireReviewUseCase {
    constructor(
        private readonly reviews: ReviewRepository,
        private readonly reports: ReportRepository,
        private readonly moderation: ModerationPort,
    ) { }

    async execute(adminId: number, reviewId: number, category: ModerationCategory, reason: string): Promise<{ idResena: number; reportesCerrados: number }> {
        const message = normalizeReason(reason);
        const retired = await this.reviews.retirePublished(reviewId, { status: ReviewStatus.Rejected, category, message });
        if (!retired) throw new ReviewNotPublishedException(reviewId);
        const closed = await this.reports.resolvePending(reviewId, ReportStatus.Retired, adminId);
        await this.moderation.recordHumanDecision(
            { loBueno: retired.loBueno, aMejorar: retired.aMejorar },
            { outcome: ModerationOutcome.Rejected, category, message, adminId },
            { reviewId, versionId: retired.versionId },
        );
        return { idResena: reviewId, reportesCerrados: closed };
    }
}
