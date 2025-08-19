import { Provider } from "@nestjs/common";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemTypeORMRepository } from "../typeorm/repository/item.typeorm.repository";

export default <Provider[]>[
    {
        provide: ItemRepository,
        useClass: ItemTypeORMRepository
    },
]