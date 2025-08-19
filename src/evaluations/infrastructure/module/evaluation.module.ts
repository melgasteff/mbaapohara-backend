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


@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyTypeORMModel,
            EvaluationTypeORMModel,
            JobTypeORMModel,
            UserTypeORMModel,
            OfficeTypeORMModel, 
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