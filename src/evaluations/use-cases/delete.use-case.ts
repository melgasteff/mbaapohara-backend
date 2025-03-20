import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteEvaluation {
    constructor(
        @InjectRepository(Evaluation) private evaluationRepository: Repository<Evaluation>
    ) { }

    async execute(id: number) {
        const result = await this.evaluationRepository.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha encontrado la evaluación', HttpStatus.NOT_FOUND)

        return result
    }
}