
import { Country } from "src/countries/domain/model/country.entity";
import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { CountryNotFoundException } from "../exception/country-not-found.exception";


export class GetCountryByIdUseCase {
    constructor(
        private readonly countryRepo: CountryRepository
    ) { }

    async execute(id: number): Promise<Country> {
        try {
            const countryFound = await this.countryRepo.getById(id)
            if (!countryFound) throw new CountryNotFoundException(id)
            return countryFound
        } catch (error) {
            console.log('Error al obtener el pais ', error)
            throw error
        }
    }
}