import { Country } from "src/countries/domain/model/country.entity";
import { NewCountry } from "src/countries/domain/model/new-country.entity";
import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { CountryAlreadyExistsException } from "../exception/country-already-exists.exception";

export class CreateCountryUseCase {
    constructor(
        private readonly countryRepo : CountryRepository
    ){}

    async execute(descripcion : string): Promise<Country>{
        try {
            const allCountries = await this.countryRepo.getAll();
            const countryFound = allCountries.find((country) => country.getDescripcion().toLowerCase() === descripcion.toLowerCase())
            if(countryFound) throw new CountryAlreadyExistsException(descripcion)

            const newCountry = new  NewCountry(descripcion)
            return await this.countryRepo.create(newCountry)
        } catch (error) {
            console.error('Error al crear el Pais', error)
            throw error;
        }
    }
}