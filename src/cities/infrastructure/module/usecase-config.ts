import { Provider } from "@nestjs/common";
import { CountCitiesUseCase } from "src/cities/application/use-case/count.use-case";
import { CreateCityUseCase } from "src/cities/application/use-case/create.use-case";
import { DeleteCityUseCase } from "src/cities/application/use-case/delete.use-case";
import { GetAllCitiesUseCase } from "src/cities/application/use-case/getAll.use-case";
import { GetCityByIdUseCase } from "src/cities/application/use-case/get-city-by-id.use-case";
import { UpdateCityUseCase } from "src/cities/application/use-case/update.use-case";
import { CityRepository } from "src/cities/domain/repository/city.repository";

export default <Provider[]>[
    
    {
        provide: CountCitiesUseCase,
        useFactory: (cityRepository: CityRepository) => new CountCitiesUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    {
        provide: CreateCityUseCase,
        useFactory: (cityRepository: CityRepository) => new CreateCityUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    {
        provide: GetCityByIdUseCase,
        useFactory: (cityRepository: CityRepository) => new GetCityByIdUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    {
        provide: DeleteCityUseCase,
        useFactory: (cityRepository: CityRepository) => new DeleteCityUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    {
        provide: UpdateCityUseCase,
        useFactory: (cityRepository: CityRepository) => new UpdateCityUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    {
        provide: GetAllCitiesUseCase,
        useFactory: (cityRepository: CityRepository) => new GetAllCitiesUseCase(cityRepository),
        inject: [ CityRepository ]
    },
    
]