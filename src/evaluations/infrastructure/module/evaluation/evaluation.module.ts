import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyTypeORMModel } from "../../typeorm/model/company.typeorm.model";
import { EvaluationTypeORMModel } from "../../typeorm/model/evaluation.typeorm.model";
import { JobTypeORMModel } from "../../typeorm/model/job.typeorm.model";
import { UserTypeORMModel } from "../../typeorm/model/user.typeorm.model";
import { OfficeTypeORMModel } from "../../typeorm/model/office.typeorm.model";
import { ContractTypeORMModel } from "../../typeorm/model/contract.typeorm.model";
import { EvaluationController } from "src/evaluations/presentation/controller/evaluation.controller";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { SalaryEvaluationTypeORMModel } from "../../typeorm/model/salaryevaluation.typeorm.model";
import { BenefitEvaluationTypeORMModel } from "../../typeorm/model/benefit-evaluation.model";
import { BenefitTypeORMModel } from "../../typeorm/model/benefit.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyTypeORMModel,
            EvaluationTypeORMModel,
            JobTypeORMModel,
            UserTypeORMModel,
            OfficeTypeORMModel, 
            ContractTypeORMModel,
            SalaryEvaluationTypeORMModel,
            BenefitEvaluationTypeORMModel,
            BenefitTypeORMModel
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        EvaluationController
    ]
})
export class EvaluationModule {}