import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";


export class GetAllSalaryEvaluationsUseCase {
    constructor(
        private salaryEvlRepo: SalaryEvaluationRepository
    ){}

    public async execute(): Promise<SalaryEvaluation[]>{
        return this.salaryEvlRepo.getAll();
    }
}