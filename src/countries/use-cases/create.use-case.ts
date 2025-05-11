import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/cities1/entities/city.entity";
import { Repository } from "typeorm";
import { Country } from "../entities/country.entity";
import { CreateCountryDto } from "../dto/create-country.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CreateCountry {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(City) private cityRepository: Repository <City>
  ) { }

  async execute(country: CreateCountryDto) {
    const countryFound = await this.countryRepository.findOne({ where: { descripcion: country.descripcion } });
    if (countryFound) throw new HttpException('El pais ya existe', HttpStatus.CONFLICT);

    try{
    const newCountry = this.countryRepository.create(country);
    return await this.countryRepository.save(newCountry);
    }catch(error){
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}