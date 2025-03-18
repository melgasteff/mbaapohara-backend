import { InjectRepository } from "@nestjs/typeorm";
import { City } from "../entities/city.entity";
import { Country } from "src/countries/entities/country.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateCityDto } from "../dto/update-city.dto";

export class UpdateCity {
    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>,
        @InjectRepository(Country) private countryRepository: Repository<Country>,
    ) { }

    async execute(id: number, city: UpdateCityDto) {
        const cityFound = await this.cityRepository.findOne({ where: { id }, relations: ['pais'] });
        if (!cityFound) return new HttpException(`La ciudad no existe`, HttpStatus.NOT_FOUND);

        const userCountry = Number(city.pais)
        const countryFound = await this.countryRepository.findOne({ where: { id: userCountry } })
        if (!countryFound) throw new HttpException("No se ha encontrado el pais", HttpStatus.NOT_FOUND)

        const updatedCity = Object.assign(cityFound, city)
        return this.cityRepository.save(updatedCity)
    }
}