import { Module } from '@nestjs/common';
import { CatalogsModule } from 'src/catalogs/catalogs.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { ModerationModule } from 'src/moderation/infrastructure/module/moderation.module';
import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { DeleteReviewUseCase } from '../../application/use-case/delete-review.use-case';
import { EditReviewUseCase } from '../../application/use-case/edit-review.use-case';
import { DecideReviewUseCase, ListModerationQueueUseCase } from '../../application/use-case/moderation-queue.use-case';
import { PublishReviewUseCase } from '../../application/use-case/publish-review.use-case';
import { GetPublicReviewUseCase, ListMyReviewsUseCase, ListPublicReviewsUseCase } from '../../application/use-case/query-reviews.use-case';
import { ReviewReferences } from '../../domain/port/review-references.port';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { ModerationQueueController } from '../../presentation/moderation-queue.controller';
import { ReviewsController } from '../../presentation/reviews.controller';
import { CatalogReviewReferences } from '../adapter/catalog-review-references';
import { SqlReviewRepository } from '../typeorm/sql-review.repository';

// Módulo completo (docs/arquitectura.md): los casos de uso no tienen decoradores de Nest; se crean acá con sus puertos.
// La moderación entra por ModerationPort, que exporta ModerationModule.
@Module({
    imports: [CatalogsModule, CompaniesModule, ModerationModule],
    controllers: [ReviewsController, ModerationQueueController],
    providers: [
        { provide: ReviewRepository, useClass: SqlReviewRepository },
        { provide: ReviewReferences, useClass: CatalogReviewReferences },
        {
            provide: PublishReviewUseCase,
            inject: [ReviewRepository, ReviewReferences, ModerationPort],
            useFactory: (repo: ReviewRepository, refs: ReviewReferences, moderation: ModerationPort) => new PublishReviewUseCase(repo, refs, moderation),
        },
        {
            provide: EditReviewUseCase,
            inject: [ReviewRepository, ReviewReferences, ModerationPort],
            useFactory: (repo: ReviewRepository, refs: ReviewReferences, moderation: ModerationPort) => new EditReviewUseCase(repo, refs, moderation),
        },
        { provide: DeleteReviewUseCase, inject: [ReviewRepository], useFactory: (repo: ReviewRepository) => new DeleteReviewUseCase(repo) },
        { provide: ListMyReviewsUseCase, inject: [ReviewRepository], useFactory: (repo: ReviewRepository) => new ListMyReviewsUseCase(repo) },
        { provide: ListPublicReviewsUseCase, inject: [ReviewRepository], useFactory: (repo: ReviewRepository) => new ListPublicReviewsUseCase(repo) },
        { provide: GetPublicReviewUseCase, inject: [ReviewRepository], useFactory: (repo: ReviewRepository) => new GetPublicReviewUseCase(repo) },
        {
            provide: ListModerationQueueUseCase,
            inject: [ReviewRepository, ModerationPort],
            useFactory: (repo: ReviewRepository, moderation: ModerationPort) => new ListModerationQueueUseCase(repo, moderation),
        },
        {
            provide: DecideReviewUseCase,
            inject: [ReviewRepository, ModerationPort],
            useFactory: (repo: ReviewRepository, moderation: ModerationPort) => new DecideReviewUseCase(repo, moderation),
        },
    ],
})
export class ReviewsModule { }
