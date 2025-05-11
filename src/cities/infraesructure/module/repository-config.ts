import { Provider } from "@nestjs/common";
import { CityTypeORMRepository } from "../typeorm/repository/city.typeorm.repository";
import { CityRepository } from "src/cities/domain/repository/city.repository";

export default <Provider[]>[
    {
        provide: CityRepository,
        useClass: CityTypeORMRepository
    },
]