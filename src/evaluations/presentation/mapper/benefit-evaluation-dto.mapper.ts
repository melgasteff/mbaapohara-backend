import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { BenefitEvaluationDTO } from "../dto/benefit-evaluation.dto";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitDTO } from "../dto/benefit.dto";
import { Contract } from "src/evaluations/domain/model/contract.entity";
import { ContractMapper } from "src/evaluations/infrastructure/mapper/contract.mapper";

export class BenefitEvaluationDTOMapper {
  static toDTO(benefitEval: BenefitEvaluation): BenefitEvaluationDTO {
    return {
      idEvaluacion: benefitEval.getIdEvaluacion(),
      beneficios: benefitEval.getBeneficios().map(b => ({
        id: b.getId(),
        descripcion: b.getDescripcion(),
        contratos: b.getContrato().map(c => ({
          id: c.getId(),
          descripcion: c.descripcion
        }))
      }))
    };
  }

  static toDomain(benefitsDto: BenefitDTO[]): Benefit[] {
  return benefitsDto.map(dto =>
    new Benefit(
      dto.id,
      dto.descripcion,
      dto.contratos.map(contractOrm =>
        ContractMapper.toDomain(contractOrm)
      )
    )
  );
}
}
