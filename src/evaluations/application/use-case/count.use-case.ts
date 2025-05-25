import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";

export class CountSalaryEvaluationsUseCase {
    constructor(
        private salaryEvlRepo : SalaryEvaluationRepository
    ){}

    execute(){
        return this.salaryEvlRepo.count();
    }
}