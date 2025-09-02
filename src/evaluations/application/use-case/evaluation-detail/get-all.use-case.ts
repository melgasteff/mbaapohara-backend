import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { Evaluation } from "src/evaluations/domain/model/evauation.entity";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";

export class GetAllEvaluationDetailsUseCase {
    
    constructor(
        private evaluationDetailRepo: EvaluationDetailRepository
    ){}

    public async execute(evaluationid: number): Promise<EvaluationDetail[]>{
        return this.evaluationDetailRepo.getAll(evaluationid);
    }
}