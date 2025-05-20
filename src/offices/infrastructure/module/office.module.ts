import { Module } from "@nestjs/common";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { OfficeTypeORMModel } from "../typeorm/model/office.typeorm.model";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfficeController } from "src/offices/presentation/controller/office.controller";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OfficeTypeORMModel,
            CompanyTypeORMModel
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        OfficeController
    ]
})
export class OfficeModule {}