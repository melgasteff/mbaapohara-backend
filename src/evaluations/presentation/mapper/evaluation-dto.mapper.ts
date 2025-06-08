import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationDTO } from "../dto/evaluation.dto";

export class EvaluationDTOMapper {
  static toDTO(evaluation: Evaluation): EvaluationDTO {
    if(evaluation.getContrato()) idcontrato: evaluation.getContrato().getId()
    return {
      id: evaluation.getId(),
      idjob: evaluation.getJob().getId(),
      iduser: evaluation.getUser().getId(),
      idcompany: evaluation.getCompany().getId(),
      idoffice: evaluation.getOffice().getId(),
     idcontrato: evaluation.getContrato()?.getId() ?? null,
      desde: evaluation.desde.toISOString(),
      hasta: evaluation.hasta.toISOString()
      
    };
  }

}