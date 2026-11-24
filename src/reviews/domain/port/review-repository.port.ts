import { Page, PageRequest } from 'src/shared/domain/page';
import { ReviewContent, ReviewStatus } from '../model/review';
import { MyReview, OwnedReview, PublicReview, PublicReviewFacets, PublicReviewFilters, PublicReviewOrder, QueueVersion, VersionToDecide } from '../model/review-views';

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
    abstract listPublic(filters: PublicReviewFilters, page: PageRequest, order: PublicReviewOrder): Promise<Page<PublicReview>>;
    /** Conteos por opción de los filtros del listado público. */
    abstract publicFacets(filters: PublicReviewFilters): Promise<PublicReviewFacets>;
    abstract findPublic(reviewId: number): Promise<PublicReview | null>;
    /** Versiones en revisión humana, la más antigua primero. */
    abstract listQueue(page: PageRequest): Promise<Page<QueueVersion>>;
    abstract findVersion(versionId: number): Promise<VersionToDecide | null>;
    /**
     * Aplica una decisión humana solo si la versión sigue en revisión (otra decisión pudo llegar antes).
     * Devuelve `false` si ya estaba decidida.
     */
    abstract decideInReview(reviewId: number, versionId: number, decision: VersionDecision): Promise<boolean>;
    /**
     * Retira la versión publicada: pasa a rechazada con la decisión y la reseña deja de verse. Devuelve la versión
     * retirada, o `null` si la reseña no tenía una versión publicada.
     */
    abstract retirePublished(reviewId: number, decision: VersionDecision): Promise<{ versionId: number; loBueno: string; aMejorar: string } | null>;
}
