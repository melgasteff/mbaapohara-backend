import { InjectRepository } from "@nestjs/typeorm";
import { City } from "src/cities/entities/city.entity";
import { Country } from "../entities/country.entity";
import { Repository } from "typeorm";

export class GetCountryCities {
    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>,
    ) { }

    execute(id: number) {
        return this.cityRepository.find({ where: { pais: { id } } })
    }

}