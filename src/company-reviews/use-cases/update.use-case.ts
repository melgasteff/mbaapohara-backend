import { InjectRepository } from "@nestjs/typeorm";
import { CompanyReview } from "../entities/company-review.entity";
import { Repository } from "typeorm";
import { UpdateCompanyReviewDto } from "../dto/update-company-review.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UpdateCompanyReview {
    constructor(
        @InjectRepository(CompanyReview) private companyReviewRep: Repository<CompanyReview>
    ) { }

    async execute(id: number, companyReview: UpdateCompanyReviewDto) {
        const companyReviewFound = await this.companyReviewRep.findOne({ where: { id_evaluacion: companyReview.id_evaluacion } })
        if (!companyReviewFound) throw new HttpException('No se ha encontrado la reseña', HttpStatus.NOT_FOUND)

        try {
            const updatedReview = Object.assign(companyReviewFound, companyReview)
            return await this.companyReviewRep.save(updatedReview)
        } catch (error) {
            console.log(error.message)
            throw new HttpException('No se ha podido actualizazr la reseña', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}