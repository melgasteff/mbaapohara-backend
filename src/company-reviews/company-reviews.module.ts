import { Module } from '@nestjs/common';
import { CompanyReviewsService } from './company-reviews.service';
import { CompanyReviewsController } from './company-reviews.controller';
import { CreateCompanyReview } from './use-cases/create.use-case';
import { DeleteCompanyReview } from './use-cases/delete.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from 'src/evaluations/entities/evaluation.entity';
import { CompanyReview } from './entities/company-review.entity';
import { UpdateCompanyReview } from './use-cases/update.use-case';
import { GetAllCompaniesReviews } from './use-cases/getAll.use-case';
import { GetCompanyReviewById } from './use-cases/getById.use-case';

@Module({
  controllers: [CompanyReviewsController],
  providers: [
    CompanyReviewsService,
    CreateCompanyReview,
    DeleteCompanyReview, 
    UpdateCompanyReview, 
    GetAllCompaniesReviews, 
    GetCompanyReviewById
  ],
  imports: [TypeOrmModule.forFeature([Evaluation, CompanyReview])],
  exports: [CompanyReviewsService]
})
export class CompanyReviewsModule {}
