import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationDTO } from "../dto/evaluation.dto";
import { EvaluationResponseDTO } from "../dto/evaluation-response.dto";

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

  static toDTOResponse(evaluation: Evaluation): EvaluationResponseDTO {
    return {
      id: evaluation.getId(),
      job: evaluation.getJob().getDescripcion(),
      company: evaluation.getCompany().getNombre(),
      office: evaluation.getOffice().getNombre(),
      desde: evaluation.getDesde().toISOString(),
      hasta: evaluation.getHasta().toISOString()
      
    };
  }

}