import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "../entities/country.entity";
import { City } from "src/cities/entities/city.entity";
import { Repository } from "typeorm";

export class GetAllCountries {
    constructor(
        @InjectRepository(Country) private countryRepository: Repository<Country>,
        @InjectRepository(City) private cityRepository: Repository<City>,
    ) { }

    execute() {
        return this.countryRepository.find()
    }
}