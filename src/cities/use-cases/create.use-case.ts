import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "src/countries/entities/country.entity";
import { City } from "../entities/city.entity";
import { Repository } from "typeorm";
import { CreateCityDto } from "../dto/create-city.dto";
import { HttpException, HttpStatus } from "@nestjs/common";


export class CreateCity {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(Country) private countryRepository: Repository<Country>
  ) { }

  async execute(city: CreateCityDto) {
    const cityFound = this.cityRepository.findOne({ where: { descripcion: city.descripcion }, relations: ['pais'] });
    if (await cityFound) throw new HttpException(`La ciudad <${city.descripcion}> ya existe`, HttpStatus.CONFLICT);

    const userCountry = Number(city.pais)
    const countryFound = await this.countryRepository.findOne({ where: { id: userCountry } })
    if (!countryFound) throw new HttpException("No se ha encontrado el pais", HttpStatus.NOT_FOUND)

    try {
      const newCity = this.cityRepository.create(city)
      return this.cityRepository.save(newCity);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}