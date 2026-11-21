import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { ReviewInput } from '../../domain/model/review';
import { ReviewReferences } from '../../domain/port/review-references.port';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { InvalidReviewException } from '../exception/review.exceptions';
import { moderateVersion, SubmitResult, validateContent } from './review-steps';

/**
 * Publica una reseña (RF1, RF3, RF4): valida, guarda la reseña con su primera versión en una transacción y la modera.
 * La persona ve el resultado al instante: publicada, en revisión o rechazada con el motivo.
 */
export class PublishReviewUseCase {
    constructor(
        private readonly repo: ReviewRepository,
        private readonly refs: ReviewReferences,
        private readonly moderation: ModerationPort,
        private readonly now: () => Date = () => new Date(),
    ) { }

    async execute(userId: number, officeId: number, input: ReviewInput): Promise<SubmitResult> {
        if (!(await this.refs.isOfficeOpen(officeId))) throw new InvalidReviewException(['El local elegido no existe']);
        const content = await validateContent(this.refs, input, this.now());
        const { reviewId, versionId } = await this.repo.create(userId, officeId, content);
        return moderateVersion(this.moderation, this.repo, reviewId, versionId, content);
    }
}
