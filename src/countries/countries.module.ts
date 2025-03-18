import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { City } from 'src/cities/entities/city.entity';
import { GetAllCountries } from './use-cases/getAllCountries.use-case';
import { CreateCountry } from './use-cases/create.use-case';
import { UpdateCountry } from './use-cases/update.use-case';
import { DeleteCountry } from './use-cases/delete.use-case';
import { GetCountryByID } from './use-cases/getCountryById.use-case';
import { GetCountryCities } from './use-cases/getCountryCities.use-case';

@Module({
  controllers: [CountriesController],
  providers: [
    CountriesService,
    GetAllCountries,
    CreateCountry,
    UpdateCountry,
    DeleteCountry,
    GetCountryByID,
    GetCountryCities
  ],
  imports: [TypeOrmModule.forFeature([Country, City])],
  exports: [CountriesService]
})
export class CountriesModule {}
