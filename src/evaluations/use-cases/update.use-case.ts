import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateEvaluationDto } from "../dto/update-evaluation.dto";

export class UpdateEvaluation {
    constructor(
        @InjectRepository(Evaluation) private evaluationRepository : Repository <Evaluation> 
    ){}

    async execute(id: number, evaluation : UpdateEvaluationDto){
        const evaluationFound = await this.evaluationRepository.findOne({where : {id}})
        if(!evaluationFound) throw new HttpException('No se ha encontrado la evaluacion', HttpStatus.NOT_FOUND)
        try {
            const updatedEvaluation = Object.assign(evaluationFound, evaluation)
            return this.evaluationRepository.save(updatedEvaluation)
        } catch (error) {
            throw new HttpException('No se ha podido actualizar la evaluacion', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}