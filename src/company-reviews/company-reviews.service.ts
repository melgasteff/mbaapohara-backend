import { Injectable } from '@nestjs/common';
import { CreateCompanyReviewDto } from './dto/create-company-review.dto';
import { UpdateCompanyReviewDto } from './dto/update-company-review.dto';
import { CreateCompanyReview } from './use-cases/create.use-case';
import { DeleteCompanyReview } from './use-cases/delete.use-case';
import { UpdateCompanyReview } from './use-cases/update.use-case';
import { GetAllCompaniesReviews } from './use-cases/getAll.use-case';
import { GetCompanyReviewById } from './use-cases/getById.use-case';

@Injectable()
export class CompanyReviewsService {
  constructor(
    private createCompanyReviewUC : CreateCompanyReview,
    private deleleCompanyReviewUC : DeleteCompanyReview,
    private updateCompanyReviewUC : UpdateCompanyReview,
    private getAllCompaniesReviewsUC : GetAllCompaniesReviews,
    private getCompanyReviewByIdUC : GetCompanyReviewById
  ){}
  createCompanyReview(companyReview: CreateCompanyReviewDto) {
    return this.createCompanyReviewUC.execute(companyReview);
  }

  getAllCompanyReviews() {
    return this.getAllCompaniesReviewsUC.execute();
  }

  getCompanyReviewById(id: number) {
    return this.getCompanyReviewByIdUC.execute(id);
  }

  updateCompanyReview(id: number, companyReview: UpdateCompanyReviewDto) {
    return this.updateCompanyReviewUC.execute(id, companyReview)
  }

  deleteCompanyRview(id: number) {
    return this.deleleCompanyReviewUC.execute(id);
  }
}
