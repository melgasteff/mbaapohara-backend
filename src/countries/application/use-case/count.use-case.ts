import { CountryRepository } from "src/countries/domain/repository/country.repository";

export class CountCountriesUseCase {
    constructor(
        private countryRepo: CountryRepository
    ){}

    public async execute(): Promise<number> {
        return this.countryRepo.count();
    }
}