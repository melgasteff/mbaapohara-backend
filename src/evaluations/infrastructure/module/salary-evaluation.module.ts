import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalaryEvaluationTypeORMModel } from "../typeorm/model/salaryevaluation.typeorm.model";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";
import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { OfficeTypeORMModel } from "../typeorm/model/office.typeorm.model";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { SalaryEvaluationController } from "src/evaluations/presentation/controller/salary-evaluation.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            SalaryEvaluationTypeORMModel,
            CompanyTypeORMModel,
            EvaluationTypeORMModel,
            JobTypeORMModel,
            UserTypeORMModel,
            OfficeTypeORMModel
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        SalaryEvaluationController
    ]
})
export class SalaryEvaluationModule {}