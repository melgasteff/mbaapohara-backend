import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyReview } from "../entities/company-review.entity";
import { Repository } from "typeorm";

export class GetCompanyReviewById {
    constructor(
        @InjectRepository(CompanyReview) private companyReviewRep: Repository<CompanyReview>
    ) { }

    async execute(id_evaluacion: number) {
        const companyReviewFound = await this.companyReviewRep.findOne({ where: { id_evaluacion } })
        if (!companyReviewFound) throw new HttpException('No se ha encontrado la reseña a la empresa', HttpStatus.NOT_FOUND)
        return companyReviewFound
    }
}