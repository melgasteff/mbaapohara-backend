import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationNotFoundException } from "../exception/salary-evaluation-not-found.exception";


export class DeleteSalaryEvaluationUseCase {
  constructor(
    private readonly salaryEvlRepo: SalaryEvaluationRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const salaryEvl = await this.salaryEvlRepo.getById(id);

      if (!salaryEvl) {throw new SalaryEvaluationNotFoundException(id); }

      await this.salaryEvlRepo.delete(id);

    } catch (error) {
      console.error("Error al eliminar la evaluacion de salario:", error);
      throw new error
    }
  }
}