import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity";
import { ReasonDetailDTO } from "../dto/reason-detail.dto";

export class ReasonDetailDTOMapper {
  static toDTO(reasonDetail: ReasonDetail): ReasonDetailDTO {
    return {
      idReason: reasonDetail.getReason().getId(),
      idEvaluationDetail: reasonDetail.getEvaluationDetail().getId()
    };
  }

}