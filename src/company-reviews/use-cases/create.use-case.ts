import { InjectRepository } from "@nestjs/typeorm";
import { CompanyReview } from "../entities/company-review.entity";
import { Repository } from "typeorm";
import { CreateCompanyReviewDto } from "../dto/create-company-review.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Evaluation } from "src/evaluations/entities/evaluation.entity";

export class CreateCompanyReview {
    constructor(
        @InjectRepository(CompanyReview) private companyReviewRep: Repository<CompanyReview>,
        @InjectRepository(Evaluation) private evaluationRep: Repository<Evaluation>
    ) { }

    async execute(companyReview: CreateCompanyReviewDto) {
        const evaluationFound = await this.evaluationRep.findOne({ where: { id: companyReview.id_evaluacion } })
        if (!evaluationFound) throw new HttpException('La evaluacion no existe', HttpStatus.INTERNAL_SERVER_ERROR)

        const companyReviewFound = await this.companyReviewRep.findOne({ where: { id_evaluacion: companyReview.id_evaluacion } })
        if (companyReviewFound) throw new HttpException('La resenha a la empresa ya existe', HttpStatus.CONFLICT)
        try {
            const newCompanyReview = await this.companyReviewRep.create(companyReview)
            return this.companyReviewRep.save(newCompanyReview)
        } catch (error) {
            console.log(error.message)
            throw new HttpException('No se ha podido crear una evaluacion de salario', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}