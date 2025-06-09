import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";


export class GetAllBenefitEvaluationsUseCase {
    constructor(
        private evaluationRepo: EvaluationRepository
    ){}

    public async execute(idEvaluacion: number): Promise<Benefit[]>{
        return await this.evaluationRepo.getBenefitEvaluations(idEvaluacion);
    }
}