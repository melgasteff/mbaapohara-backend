import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "src/countries/entities/country.entity";
import { Repository } from "typeorm";
import { City } from "../entities/city.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetCityById {
    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>,
        @InjectRepository(Country) private countryRepository: Repository<Country>,
    ) { }
    execute(id: number) {
        const cityFound = this.cityRepository.findOne({ where: { id }, relations: ['pais'] });
        if (!cityFound) return new HttpException('No se encontró la ciudad', HttpStatus.NOT_FOUND);
        return cityFound;
    }
}