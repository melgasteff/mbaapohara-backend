import { InjectRepository } from "@nestjs/typeorm";
import { CompanyReview } from "../entities/company-review.entity";
import { Repository } from "typeorm";

export class GetAllCompaniesReviews {
    constructor(
        @InjectRepository(CompanyReview) private companyReviewRep : Repository<CompanyReview>
    ){}

    execute (){
        return this.companyReviewRep.find()
    }
}