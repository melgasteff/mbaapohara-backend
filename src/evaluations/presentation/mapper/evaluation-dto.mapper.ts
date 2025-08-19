import { Evaluation } from "src/evaluations/domain/model/evauation.entity";
import { EvaluationDTO } from "../dto/evaluation.dto";

export class EvaluationDTOMapper {
  static toDTO(evaluation: Evaluation): EvaluationDTO {
    return {
      id: evaluation.getId(),
      idjob: evaluation.getJob().getId(),
      iduser: evaluation.getUser().getId(),
      idcompany: evaluation.getCompany().getId(),
      idoffice: evaluation.getOffice().getId(),
      desde: evaluation.getDesde().toISOString(),
      hasta: evaluation.getHasta().toISOString()
      
    };
  }

}