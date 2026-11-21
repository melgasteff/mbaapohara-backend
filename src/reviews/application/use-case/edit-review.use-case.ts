import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { ReviewInput, ReviewStatus } from '../../domain/model/review';
import { ReviewReferences } from '../../domain/port/review-references.port';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { ReviewInReviewException, ReviewNotFoundException } from '../exception/review.exceptions';
import { moderateVersion, SubmitResult, validateContent } from './review-steps';

/**
 * Edita una reseña propia: guarda una versión nueva y la modera. La versión publicada sigue visible hasta que la nueva
 * se publique; si la nueva se rechaza, queda la anterior (política, sección 7; confirmado el 21/11).
 */
export class EditReviewUseCase {
    constructor(
        private readonly repo: ReviewRepository,
        private readonly refs: ReviewReferences,
        private readonly moderation: ModerationPort,
        private readonly now: () => Date = () => new Date(),
    ) { }

    async execute(userId: number, reviewId: number, input: ReviewInput): Promise<SubmitResult> {
        const review = await this.repo.findOwned(reviewId, userId);
        if (!review) throw new ReviewNotFoundException(reviewId);
        if (review.lastStatus === ReviewStatus.InReview) throw new ReviewInReviewException();
        const content = await validateContent(this.refs, input, this.now());
        const { versionId } = await this.repo.addVersion(reviewId, content);
        return moderateVersion(this.moderation, this.repo, reviewId, versionId, content);
    }
}
