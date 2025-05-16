import { Module } from "@nestjs/common";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { UserController } from "src/users/presentation/controller/user.controller";

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
        UserController
    ]
})
export class UserModule {}