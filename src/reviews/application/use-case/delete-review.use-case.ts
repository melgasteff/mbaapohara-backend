import { ReviewRepository } from '../../domain/port/review-repository.port';
import { ReviewNotFoundException } from '../exception/review.exceptions';

/** Borra una reseña propia con sus versiones y respuestas (derecho de supresión; confirmado el 21/11). */
export class DeleteReviewUseCase {
    constructor(private readonly repo: ReviewRepository) { }

    async execute(userId: number, reviewId: number): Promise<void> {
        if (!(await this.repo.findOwned(reviewId, userId))) throw new ReviewNotFoundException(reviewId);
        await this.repo.delete(reviewId);
    }
}
