import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { BenefitEvaluationTypeORMModel } from "../typeorm/model/benefit-evaluation.model";
import { BenefitsMapper } from "./benefit.mapper";

export class BenefitEvaluationMapper {

  static toDomain(benefitEvalTypeOrm: BenefitEvaluationTypeORMModel): BenefitEvaluation {
    return new BenefitEvaluation(
      benefitEvalTypeOrm.idEvaluacion,
      BenefitsMapper.toDomainList(benefitEvalTypeOrm.beneficios)
    )
  }

  static toDomainList(benefitEvalTypeOrmList: BenefitEvaluationTypeORMModel[]): BenefitEvaluation[]{
    return benefitEvalTypeOrmList.map(benefitEvalTypeOrm => BenefitEvaluationMapper.toDomain(benefitEvalTypeOrm))
  }
}