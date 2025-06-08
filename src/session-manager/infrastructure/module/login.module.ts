import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { LoginController } from "src/session-manager/presentation/controller/login.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        LoginController
    ]
})
export class LoginModule {}