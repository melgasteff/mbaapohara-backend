import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";

export class CountEvaluationsUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ) { }

    execute():Promise<number>{
        return this.evaluationRepo.count()
    }
}