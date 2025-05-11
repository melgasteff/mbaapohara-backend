import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "../entities/country.entity";
import { City } from "src/cities1/entities/city.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetCountryByID{
    constructor(
        @InjectRepository(Country) private countryRepository: Repository<Country>,
        @InjectRepository(City) private cityRepository: Repository<City>,
    ) { }

    execute(id: number) {
        const countryFound = this.countryRepository.findOne({ where: { id } });
        if (!countryFound) return new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND);

        return countryFound;
    }
}