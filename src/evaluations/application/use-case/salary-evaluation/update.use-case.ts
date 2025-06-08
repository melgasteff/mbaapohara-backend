import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationNotFoundException } from "../../exception/salary-evaluation/salary-evaluation-not-found.exception";


export class UpdateSalaryEvaluationUseCase {
  constructor(
    private readonly salaryEvlRepo: SalaryEvaluationRepository,
  ) {}

  async execute(
    idEvaluacion: number,
    base: string,
    experienciaArea: string,
    experienciaEmpresa: string,
    bono: string,
    comision: string,
    propina: string,
    moneda: string,
    frecuencia: string,
    modalidad: string
  ): Promise<SalaryEvaluation> {
    try {
      const salaryEvlFound = await this.salaryEvlRepo.getById(idEvaluacion);

      if (!salaryEvlFound) {
        throw new SalaryEvaluationNotFoundException(idEvaluacion);
      }

      const salaryEvlToUpdate = new SalaryEvaluation(
        idEvaluacion,
        base,
        experienciaArea,
        experienciaEmpresa,
        bono,
        comision,
        propina,
        moneda,
        frecuencia,
        modalidad
      );

      return await this.salaryEvlRepo.update(idEvaluacion, salaryEvlToUpdate);
    } catch (error) {
      console.error("Error al actualizar la evaluación de salario:", error);
      throw error;
    }
  }
}