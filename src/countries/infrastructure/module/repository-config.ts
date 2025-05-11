import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { CountryTypeORMRepository } from "../typeorm/repository/country.typeorm.repository";
import { Provider } from "@nestjs/common";

export default <Provider[]>[
    {
        provide: CountryRepository,
        useClass: CountryTypeORMRepository
    },
]