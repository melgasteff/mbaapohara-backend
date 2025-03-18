import { InjectRepository } from "@nestjs/typeorm";
import { Country } from "../entities/country.entity";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";

export class DeleteCountry {
    constructor(
        @InjectRepository(Country) private countryRepository: Repository<Country>
    ) { }
    
    async execute(id: number) {
        const result = await this.countryRepository.delete({ id });
        if (result.affected === 0) return new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND);
        return result;
      }
}