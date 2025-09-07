import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationDetailTypeORMModel } from "../typeorm/model/evaluation-detail.typeorm.model";
import { EvaluationMapper } from "./evaluation.mapper";
import { ItemMapper } from "./item.mapper";
import { NewEvaluationDetail } from "src/evaluations/domain/model/new-evaluation-detail.entity";

export class EvaluationDetailMapper {
    static toDomain(
        evaluationDetailTypeOrm: EvaluationDetailTypeORMModel
    ): EvaluationDetail {
        return new EvaluationDetail(
            evaluationDetailTypeOrm.id,
            EvaluationMapper.toDomain(evaluationDetailTypeOrm.evaluation),
            ItemMapper.toDomain(evaluationDetailTypeOrm.item),
            evaluationDetailTypeOrm.rating,
            evaluationDetailTypeOrm.extra_reason ?? null, 
        );
    }

    static toTypeORMModel(
        newEvaluationDetail: NewEvaluationDetail
    ): EvaluationDetailTypeORMModel {
        const evaluationDetailTypeORM = new EvaluationDetailTypeORMModel();
        evaluationDetailTypeORM.evaluation = EvaluationMapper.toTypeORMReference(
            newEvaluationDetail.getEvaluation()
        );
        evaluationDetailTypeORM.item = ItemMapper.toTypeORMReference(
            newEvaluationDetail.getItem()
        );

        evaluationDetailTypeORM.rating = newEvaluationDetail.getRating();
        evaluationDetailTypeORM.extra_reason = newEvaluationDetail.getExtraReason();

        return evaluationDetailTypeORM;
    }
}