import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountryTypeORMModel } from "../typeorm/model/country.typeorm.model";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { CountryController } from "src/countries/presentation/rest/controller/country.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CountryTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        CountryController
    ]
})
export class CountryModule {}