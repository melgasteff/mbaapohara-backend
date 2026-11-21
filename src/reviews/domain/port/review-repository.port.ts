import { Page, PageRequest } from 'src/shared/domain/page';
import { ReviewContent, ReviewStatus } from '../model/review';
import { MyReview, OwnedReview, PublicReview, PublicReviewFilters } from '../model/review-views';

/** Resultado de moderar una versión, tal como se guarda en ella. */
export interface VersionDecision {
    status: ReviewStatus;
    category: string | null;
    message: string | null;
}

/** Persistencia de las reseñas. Los métodos que escriben son atómicos: guardan todo o nada. */
export abstract class ReviewRepository {
    /**
     * Crea la reseña con su primera versión (en revisión) y sus respuestas; si el cargo es propuesto, lo crea pendiente.
     * Lanza `ReviewAlreadyExistsException` si la persona ya tiene una reseña de ese local.
     */
    abstract create(userId: number, officeId: number, content: ReviewContent): Promise<{ reviewId: number; versionId: number }>;
    /** Agrega una versión nueva (en revisión) a una reseña existente. */
    abstract addVersion(reviewId: number, content: ReviewContent): Promise<{ versionId: number }>;
    /** Guarda la decisión en la versión; si se publicó, pasa a ser la versión visible de la reseña. */
    abstract applyDecision(reviewId: number, versionId: number, decision: VersionDecision): Promise<void>;
    /** Reseña de esa persona, o `null` si no existe o es de otra. */
    abstract findOwned(reviewId: number, userId: number): Promise<OwnedReview | null>;
    /** Borra la reseña con sus versiones y respuestas. */
    abstract delete(reviewId: number): Promise<void>;
    abstract listMine(userId: number): Promise<MyReview[]>;
    abstract listPublic(filters: PublicReviewFilters, page: PageRequest): Promise<Page<PublicReview>>;
    abstract findPublic(reviewId: number): Promise<PublicReview | null>;
}
