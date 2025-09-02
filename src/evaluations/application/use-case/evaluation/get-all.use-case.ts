import { Evaluation } from "src/evaluations/domain/model/evauation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";

export class GetAllEvaluationsUseCase {
    
    constructor(
        private evaluationRepo: EvaluationRepository
    ){}

    public async execute(): Promise<Evaluation[]>{
        return this.evaluationRepo.getAll();
    }
}