import { CountryRepository } from "src/countries/domain/repository/country.repository";

export class GetAllCountriesUseCase {
    constructor(
        private readonly countryRepo : CountryRepository
    ){}

    execute(){
        return this.countryRepo.getAll();
    }
}