import { TypeOrmModule } from "@nestjs/typeorm";
import { CityTypeORMModel } from "../typeorm/model/city.typeorm.model";
import { Module } from '@nestjs/common';
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { CityController } from "src/cities/presentation/rest/controller/city.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CityTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        CityController
    ]
})
export class CityModule {}