import { Provider } from "@nestjs/common";
import { CountCountriesUseCase } from "src/countries/application/use-case/count.use-case";
import { CreateCountryUseCase } from "src/countries/application/use-case/create.use-case";
import { DeleteCountryUseCase } from "src/countries/application/use-case/delete.use-case";
import { GetAllCountriesUseCase } from "src/countries/application/use-case/get-all.use-case";
import { GetCountryByIdUseCase } from "src/countries/application/use-case/get-by-id.use-case";
import { UpdateCountryUseCase } from "src/countries/application/use-case/update.use-case";
import { CountryRepository } from "src/countries/domain/repository/country.repository";

export default <Provider[]>[
    
    {
        provide: CountCountriesUseCase,
        useFactory: (countryRepository: CountryRepository) => new CountCountriesUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    {
        provide: CreateCountryUseCase,
        useFactory: (countryRepository: CountryRepository) => new CreateCountryUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    {
        provide: GetCountryByIdUseCase,
        useFactory: (countryRepository: CountryRepository) => new GetCountryByIdUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    {
        provide: DeleteCountryUseCase,
        useFactory: (countryRepository: CountryRepository) => new DeleteCountryUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    {
        provide: UpdateCountryUseCase,
        useFactory: (countryRepository: CountryRepository) => new UpdateCountryUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    {
        provide: GetAllCountriesUseCase,
        useFactory: (countryRepository: CountryRepository) => new GetAllCountriesUseCase(countryRepository),
        inject: [ CountryRepository ]
    },
    
    
]