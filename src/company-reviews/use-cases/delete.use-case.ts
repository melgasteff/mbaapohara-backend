import { InjectRepository } from "@nestjs/typeorm";
import { CompanyReview } from "../entities/company-review.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteCompanyReview {
    constructor(
        @InjectRepository(CompanyReview) private companyReviewRep: Repository<CompanyReview>
    ) { }

    async execute(id: number) {
        const result = await this.companyReviewRep.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar la reseña a la empresa', HttpStatus.INTERNAL_SERVER_ERROR)
        return result
    }
}