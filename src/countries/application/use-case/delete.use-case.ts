import { CountryNotFoundException } from "src/cities/application/exception/country-not-found.exception";
import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { CountryInUseException } from "../exception/country-in-use.exception";

export class DeleteCountryUseCase {
    constructor(
        private readonly countryRepo : CountryRepository
    ){}

    async execute(id: number) : Promise<void>{
        try {
            const country =await this.countryRepo.getById(id)
            if(!country) throw new CountryNotFoundException
            await this.countryRepo.delete(id)
        } catch (error) {
            console.log('Error al eliminar el pais' , error)
            if(error instanceof Error && error.message.includes('foreign key'))  throw new CountryInUseException(id)
            throw new error
        }
    }
}