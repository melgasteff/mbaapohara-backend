import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";
import { CreateEvaluationDto } from "../dto/create-evaluation.dto";
import { HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { Office } from "src/offices/entities/office.entity";

export class CreateEvaluation {
    constructor(
        @InjectRepository(Evaluation) private evaluationRepository: Repository<Evaluation>,
        @InjectRepository(Office) private officeRepository: Repository<Office>
    ) { }

    async execute(evaluation: CreateEvaluationDto) {

        if (!evaluation.company && !evaluation.office) throw new HttpException('No se ha seleccionado la empresa', HttpStatus.AMBIGUOUS)

        const officeFound = await this.officeRepository.findOne({ 
            where: { 
                id: evaluation.office, 
                empresa: {id: evaluation.company} 

            } })
        if (!officeFound) throw new HttpException('La sucursal no corresponde a la empresa', HttpStatus.CONFLICT)

        const evaluationFound = await this.evaluationRepository.findOne({
            where: {
                company: {id: evaluation.company},
                user: {id: evaluation.user},
                office: {id: evaluation.office},
                job: {id: evaluation.job}
            },
            relations: ['company', 'user', 'office', 'job']
        })

        console.log(evaluationFound)

        if (evaluationFound) throw new HttpException('La evaluación ya ha sido realizada', HttpStatus.CONFLICT)

        try {
            const newEvaluation = this.evaluationRepository.create({
                company: { id: evaluation.company },
                user: { id: evaluation.user },
                office: { id: evaluation.office },
                job: { id: evaluation.job }
            });
            return await this.evaluationRepository.save(newEvaluation)
        } catch (error) {
            throw new HttpException('No se ha podido crear la evaluacion', HttpStatus.INTERNAL_SERVER_ERROR)
        }


    }
}