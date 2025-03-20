import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetEvaluationById {
    constructor(
        @InjectRepository(Evaluation) private evaluationRepository: Repository<Evaluation>
    ) { }

    async execute(id: number) {
        const evaluationFound =await this.evaluationRepository.findOne({ where: { id }, relations: ['company', 'job', 'user', 'office'] })

        if (!evaluationFound) throw new HttpException('No se ha encontrado la evaluacion', HttpStatus.NOT_FOUND)
        return evaluationFound
    }
}