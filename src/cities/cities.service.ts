import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { CreateCity } from './use-cases/create.use-case';
import { UpdateCity } from './use-cases/update.use-case';
import { DeleteCity } from './use-cases/delete.use-case';
import { GetCityById } from './use-cases/getCityById.use-case';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    private readonly createCityUC: CreateCity,
    private readonly updateCityUC: UpdateCity,
    private readonly deleteCityUC: DeleteCity,
    private readonly getCityByIdUC: GetCityById
  ) { }

  createCity(city: CreateCityDto) {
    return this.createCityUC.execute(city)
  }

  getCities() {
    return this.cityRepository.find({ relations: ['pais'] })
  }

  getCityById(id: number) {
    return this.getCityByIdUC.execute(id)
  }

  updateCity(id: number, city: UpdateCityDto) {
    return this.updateCityUC.execute(id, city)
  }

  deleteCity(id: number) {
    return this.deleteCityUC.execute(id)
  }

}
