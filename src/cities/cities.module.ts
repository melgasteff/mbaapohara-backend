import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { DeleteCity } from './use-cases/delete.use-case';
import { UpdateCity } from './use-cases/update.use-case';
import { CreateCity } from './use-cases/create.use-case';
import { GetCityById } from './use-cases/getCityById.use-case';

@Module({
  controllers: [CitiesController],
  providers: [
    CitiesService,
    DeleteCity,
    UpdateCity,
    CreateCity,
    GetCityById,
  ],
  imports: [TypeOrmModule.forFeature([City, Country])],
  exports:[CitiesService]
})
export class CitiesModule {}
