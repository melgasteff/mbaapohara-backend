import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";
import { CompanyController } from "src/companies/presentation/controller/company.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        CompanyController
    ]
})
export class CompanyModule {}