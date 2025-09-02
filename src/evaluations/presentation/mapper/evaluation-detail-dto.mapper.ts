import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationDetailDTO } from "../dto/evaluation-detail.dto";

export class EvaluationDetailDTOMapper {
  static toDTO(evaluationDetail: EvaluationDetail): EvaluationDetailDTO {
    return {
      id: evaluationDetail.getId(),
      idevaluation: evaluationDetail.getEvaluation().getId(),
      iditem: evaluationDetail.getItem().getId(),
      rating: evaluationDetail.getRating(),
      extraReason: evaluationDetail.getExtraReason()
      
    };
  }

}