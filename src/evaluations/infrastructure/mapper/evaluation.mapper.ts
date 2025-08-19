import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { JobMapper } from "./job.mapper";
import { UserMapper } from "./user.mapper";
import { CompanyMapper } from "./company.mapper";
import { OfficeMapper } from "./office.mapper";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";
import { Evaluation } from "src/evaluations/domain/model/evauation.entity";

export class EvaluationMapper {
    static toDomain(evaluationTypeOrm: EvaluationTypeORMModel): Evaluation {
        console.log('En evaluationmapper',  OfficeMapper.toDomain(evaluationTypeOrm.office),)
        return new Evaluation(
            evaluationTypeOrm.id,
            UserMapper.toDomain(evaluationTypeOrm.user),
            JobMapper.toDomain(evaluationTypeOrm.job),
            OfficeMapper.toDomain(evaluationTypeOrm.office),
            CompanyMapper.toDomain(evaluationTypeOrm.company),
            evaluationTypeOrm.desde,
            evaluationTypeOrm.hasta,
        );
    }

    static toTypeORMModel(newEvaluation: NewEvaluation): EvaluationTypeORMModel {
        const evaluationTypeORM = new EvaluationTypeORMModel();
        evaluationTypeORM.job = JobMapper.toTypeORMModel(newEvaluation.getJob());
        evaluationTypeORM.user = UserMapper.toTypeORMModel(newEvaluation.getUser());
        evaluationTypeORM.company = CompanyMapper.toTypeORMModel(newEvaluation.getCompany());
        evaluationTypeORM.office = OfficeMapper.toTypeORMModel(newEvaluation.getOffice());
        evaluationTypeORM.desde = newEvaluation.getDesde();
        evaluationTypeORM.hasta = newEvaluation.getHasta();
        return evaluationTypeORM;
    }
}