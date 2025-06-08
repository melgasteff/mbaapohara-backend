import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationTypeORMModel } from "../typeorm/model/salaryevaluation.typeorm.model";
import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { NewSalaryEvaluation } from "src/evaluations/domain/model/new-salary-evaluation.entity";


export class SalaryEvaluationMapper {

  static toDomain(
    salaryEvlTypeOrm: SalaryEvaluationTypeORMModel,
    evaluationTypeOrm: EvaluationTypeORMModel
  ): SalaryEvaluation {
    return new SalaryEvaluation(
      evaluationTypeOrm.id,
      salaryEvlTypeOrm.base,
      salaryEvlTypeOrm.experienciaArea,
      salaryEvlTypeOrm.experienciaEmpresa,
      salaryEvlTypeOrm.bono,
      salaryEvlTypeOrm.comision,
      salaryEvlTypeOrm.propina,
      salaryEvlTypeOrm.moneda,
      salaryEvlTypeOrm.frecuencia,
      salaryEvlTypeOrm.modalidad
    );
  }

  static SalarytoTypeORMModel(salaryEvl: SalaryEvaluation): SalaryEvaluationTypeORMModel {
    const salaryEvalTypeOrm = new SalaryEvaluationTypeORMModel();
    salaryEvalTypeOrm.idEvaluacion = salaryEvl.idEvaluacion;
    salaryEvalTypeOrm.base = salaryEvl.getBase();
    salaryEvalTypeOrm.experienciaArea = salaryEvl.getExperienciaArea();
    salaryEvalTypeOrm.experienciaEmpresa = salaryEvl.getExperienciaEmpresa();
    salaryEvalTypeOrm.bono = salaryEvl.getBono();
    salaryEvalTypeOrm.comision = salaryEvl.getComision();
    salaryEvalTypeOrm.propina = salaryEvl.getPropina();
    salaryEvalTypeOrm.moneda = salaryEvl.getMoneda();
    salaryEvalTypeOrm.frecuencia = salaryEvl.getFrecuencia();
    salaryEvalTypeOrm.modalidad = salaryEvl.getModalidad();
    return salaryEvalTypeOrm;
  }
}