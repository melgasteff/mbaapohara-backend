import { Country } from "src/countries/domain/model/country.entity";
import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { CountryNotFoundException } from "../exception/country-not-found.exception";

export class UpdateCountryUseCase {
    constructor(
        private readonly countryRepo : CountryRepository
    ){}

    async execute(id: number, country:Country): Promise<Country>{
        try {
            const allCountries = await this.countryRepo.getAll()
            const countryFound = allCountries.find((country)=> country.getId()== id)
            if(!countryFound) throw new CountryNotFoundException(id)
            return this.countryRepo.update(id, country)
        } catch (error) {
            console.log('Error al actualizar la ciudad' , error)
            throw new error
        }
    }
}