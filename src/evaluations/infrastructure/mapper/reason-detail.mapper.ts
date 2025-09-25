import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity";
import { ReasonDetailTypeORMModel } from "../typeorm/model/reason-detail.typeorm.model";
import { EvaluationDetailMapper } from "./evaluation-detail.mapper";
import { ReasonMapper } from "./reason.mapper";

export class ReasonDetailMapper {
   static toDomain(reasonDetailTypeOrm: ReasonDetailTypeORMModel): ReasonDetail {
    console.log(reasonDetailTypeOrm.evaluationDetail)
           const evaluationDetail = EvaluationDetailMapper.toDomain(reasonDetailTypeOrm.evaluationDetail);
           const reason = ReasonMapper.toDomain(reasonDetailTypeOrm.reason)
           return new ReasonDetail(
            reason,
            evaluationDetail
            );
       }
   
       static toTypeORMModel(reasonDetail: ReasonDetail): ReasonDetailTypeORMModel {
           const reasonTypeorm = new ReasonDetailTypeORMModel();
           reasonTypeorm.idEvaluation = reasonDetail.getEvaluationDetail().getId();
           reasonTypeorm.idReason = reasonDetail.getReason().getId()
           return reasonTypeorm;
       }
}