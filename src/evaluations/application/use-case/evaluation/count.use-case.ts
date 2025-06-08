import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";

export class CountEvaluationsUseCase {
    constructor(
        private evaluationRepo : EvaluationRepository
    ){}

    execute(){
        return this.evaluationRepo.count();
    }
}