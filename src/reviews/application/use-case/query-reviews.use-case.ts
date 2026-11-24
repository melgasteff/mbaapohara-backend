import { Page, PageRequest } from 'src/shared/domain/page';
import { MyReview, PublicReview, PublicReviewFacets, PublicReviewFilters, PublicReviewOrder } from '../../domain/model/review-views';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { ReviewNotFoundException } from '../exception/review.exceptions';

/** Reseñas de la persona, con el estado y el motivo de su última versión («Mis reseñas»). */
export class ListMyReviewsUseCase {
    constructor(private readonly repo: ReviewRepository) { }

    execute(userId: number): Promise<MyReview[]> {
        return this.repo.listMine(userId);
    }
}

/** Reseñas publicadas, con los filtros de RF5. */
export class ListPublicReviewsUseCase {
    constructor(private readonly repo: ReviewRepository) { }

    execute(filters: PublicReviewFilters, page: PageRequest, order = PublicReviewOrder.Recent): Promise<Page<PublicReview>> {
        return this.repo.listPublic(filters, page, order);
    }
}

/** Conteos de los filtros del listado público, para el perfil de una empresa. */
export class PublicReviewFacetsUseCase {
    constructor(private readonly repo: ReviewRepository) { }

    execute(filters: PublicReviewFilters): Promise<PublicReviewFacets> {
        return this.repo.publicFacets(filters);
    }
}

/** Una reseña publicada. Si no está publicada, no existe para el público. */
export class GetPublicReviewUseCase {
    constructor(private readonly repo: ReviewRepository) { }

    async execute(reviewId: number): Promise<PublicReview> {
        const review = await this.repo.findPublic(reviewId);
        if (!review) throw new ReviewNotFoundException(reviewId);
        return review;
    }
}
