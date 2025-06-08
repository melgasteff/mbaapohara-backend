import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { JobMapper } from "./job.mapper";
import { UserMapper } from "./user.mapper";
import { CompanyMapper } from "./company.mapper";
import { OfficeMapper } from "./office.mapper";
import { ContractMapper } from "./contract.mapper";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";

export class EvaluationMapper {
    static toDomain(evaluationTypeOrm: EvaluationTypeORMModel): Evaluation {
        return new Evaluation(
            evaluationTypeOrm.id,
            JobMapper.toDomain(evaluationTypeOrm.job),
            UserMapper.toDomain(evaluationTypeOrm.user),
            CompanyMapper.toDomain(evaluationTypeOrm.company),
            OfficeMapper.toDomain(evaluationTypeOrm.office),
            evaluationTypeOrm.desde,
            evaluationTypeOrm.hasta,
            evaluationTypeOrm.contrato ? ContractMapper.toDomain(evaluationTypeOrm.contrato) : null,
            //SalaryEvaluationMapper.toDomain(evaluationTypeOrm.salaryEvaluation)
        );
    }

    static toTypeORMModel(newEvaluation: NewEvaluation): EvaluationTypeORMModel {
        const evaluationTypeORM = new EvaluationTypeORMModel();
        evaluationTypeORM.job = JobMapper.toTypeORMModel(newEvaluation.getJob());
        evaluationTypeORM.user = UserMapper.toTypeORMModel(newEvaluation.getUser());
        evaluationTypeORM.company = CompanyMapper.toTypeORMModel(newEvaluation.getCompany());
        evaluationTypeORM.office = OfficeMapper.toTypeORMModel(newEvaluation.getOffice());
        evaluationTypeORM.desde = newEvaluation.desde;
        evaluationTypeORM.hasta = newEvaluation.hasta;
        const contrato = newEvaluation.getContrato();
        if (contrato) {evaluationTypeORM.contrato = ContractMapper.toTypeORMModel(contrato);}
        return evaluationTypeORM;
    }
}