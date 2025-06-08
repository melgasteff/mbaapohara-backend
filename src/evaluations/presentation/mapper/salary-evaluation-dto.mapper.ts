import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationDTO } from "../dto/salary-evaluation.dto";

export class SalaryEvaluationDTOMapper {
  static toDTO(salaryEvl: SalaryEvaluation): SalaryEvaluationDTO {
    return {
      idEvaluacion: salaryEvl.getIdEvaluacion(),
      base: salaryEvl.getBase(),
      experienciaArea: salaryEvl.getExperienciaArea(),
      experienciaEmpresa: salaryEvl.getExperienciaEmpresa(),
      bono: salaryEvl.getBono(),
      comision: salaryEvl.getComision(),
      propina: salaryEvl.getPropina(),
      moneda: salaryEvl.getMoneda(),
      frecuencia: salaryEvl.getFrecuencia(),
      modalidad: salaryEvl.getModalidad()
    };
  }
}