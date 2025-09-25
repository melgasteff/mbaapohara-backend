import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { EvaluationController } from "src/evaluations/presentation/controller/evaluation.controller";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";
import { EvaluationTypeORMModel } from "../typeorm/model/evaluation.typeorm.model";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { OfficeTypeORMModel } from "../typeorm/model/office.typeorm.model";
import { EvaluationDetailTypeORMModel } from "../typeorm/model/evaluation-detail.typeorm.model";
import { ItemTypeORMModel } from "../typeorm/model/item.typeorm.model";
import { ReasonDetailTypeORMModel } from "../typeorm/model/reason-detail.typeorm.model";
import { ReasonTypeORMModel } from "../typeorm/model/reason.typeorm.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyTypeORMModel,
            EvaluationTypeORMModel,
            JobTypeORMModel,
            UserTypeORMModel,
            OfficeTypeORMModel, 
            ItemTypeORMModel,
            EvaluationDetailTypeORMModel, 
            ReasonDetailTypeORMModel,
            ReasonTypeORMModel
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