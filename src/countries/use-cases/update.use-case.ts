import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "../entities/country.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateCountryDto } from "../dto/update-country.dto";

export class UpdateCountry {
    constructor(
        @InjectRepository(Country) private countryRepository: Repository<Country>
    ) { }
    
    async execute(id: number, country: UpdateCountryDto) {
        const countryFound = await this.countryRepository.findOne({ where: { id } });
        if (!countryFound) return new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND);

        const updatedCountry = Object.assign(countryFound, country)
        return this.countryRepository.save(updatedCountry)
    }
}