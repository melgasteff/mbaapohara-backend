import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";

export class CountEvaluationDetailsUseCase {
    constructor(
        private readonly evaluationDetailRepo: EvaluationDetailRepository
    ) { }

    execute():Promise<number>{
        return this.evaluationDetailRepo.count()
    }
}