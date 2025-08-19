import { ItemController } from "src/items/presentation/controller/item.controller";
import { ItemTypeORMModel } from "../typeorm/model/item.typeorm.model";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ItemTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        ItemController
    ]
})
export class ItemModule {}