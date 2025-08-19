import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryTypeORMModel } from "../typeorm/model/category.typeorm.model";
import { CategoryController } from "src/categories/presentation/controller/category.controller";
import RepositoryConfig from "./repository-config"
import UseCaseConfig from "./usecase-config";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CategoryTypeORMModel,
        ])
    ],
    providers: [
        ...RepositoryConfig,
        ...UseCaseConfig
    ],
    controllers: [
        CategoryController
    ]
})
export class CategoryModule {}