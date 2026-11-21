import { Page, PageRequest } from 'src/shared/domain/page';
import { ReportCategory, ReportedReview, ReportStatus } from '../model/report';

/** Persistencia de los reportes. */
export abstract class ReportRepository {
    /** Lanza `ReportAlreadyExistsException` si esa cuenta ya reportó la reseña. */
    abstract create(reviewId: number, userId: number, category: ReportCategory, comment: string | null): Promise<void>;
    /** Reseñas con reportes pendientes, agrupados; la del reporte más antiguo primero. */
    abstract listPending(page: PageRequest): Promise<Page<ReportedReview>>;
    /** Cierra los reportes pendientes de una reseña. Devuelve cuántos cerró. */
    abstract resolvePending(reviewId: number, status: ReportStatus.Kept | ReportStatus.Retired, adminId: number): Promise<number>;
}
