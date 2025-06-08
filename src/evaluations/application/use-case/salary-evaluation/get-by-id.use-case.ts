import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationNotFoundException } from "../../exception/salary-evaluation/salary-evaluation-not-found.exception";


export class GetSalaryEvaluationByIdUseCase {
    constructor(
        private readonly salaryEvlRepo: SalaryEvaluationRepository
    ) { }

    async execute(id: number): Promise<SalaryEvaluation> {
        try {
            const salaryEvlFound = await this.salaryEvlRepo.getById(id)
            if (!salaryEvlFound) throw new SalaryEvaluationNotFoundException(id)
            return salaryEvlFound
        } catch (error) {
            console.error("Error al obtener la evaluacion de salario", error);
            throw error;
        }

    }
}