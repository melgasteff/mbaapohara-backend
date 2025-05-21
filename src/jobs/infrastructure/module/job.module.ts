import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { JobController } from "src/jobs/presentation/controller/job.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        JobController
    ]
})
export class JobModule {}