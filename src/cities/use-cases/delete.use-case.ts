import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "src/countries/entities/country.entity";
import { Repository } from "typeorm";
import { City } from "../entities/city.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteCity {
    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>,
        @InjectRepository(Country) private countryRepository: Repository<Country>,
    ) { }
    async execute(id: number) {
        const result = await this.cityRepository.delete({ id });
        if (result.affected === 0) return new HttpException('La ciudad no se ha encontrado', HttpStatus.NOT_FOUND);
        return result;
    }
}