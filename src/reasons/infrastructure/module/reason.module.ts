import { ReasonController } from "src/reasons/presentation/controller/reason.controller";
import { ReasonTypeORMModel } from "../typeorm/model/reason.typeorm.model";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ReasonTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        ReasonController
    ]
})
export class ReasonModule {}