import { Provider } from "@nestjs/common";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryTypeORMRepository } from "../typeorm/repository/category.typeorm.repository";

export default <Provider[]>[
    {
        provide: CategoryRepository,
        useClass: CategoryTypeORMRepository
    },
]