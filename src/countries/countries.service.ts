import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CreateCountry } from './use-cases/create.use-case';
import { UpdateCountry } from './use-cases/update.use-case';
import { DeleteCountry } from './use-cases/delete.use-case';
import { GetCountryCities } from './use-cases/getCountryCities.use-case';
import { GetCountryByID } from './use-cases/getCountryById.use-case';
import { GetAllCountries } from './use-cases/getAllCountries.use-case';

@Injectable()
export class CountriesService {
  constructor(
    private readonly createCountryUC: CreateCountry,
    private readonly updateCountryUC: UpdateCountry,
    private readonly deleteCountryUC: DeleteCountry,
    private readonly getCountryCitiesUC: GetCountryCities,
    private readonly getCountryByIdUC: GetCountryByID,
    private readonly getAllCountriesUC: GetAllCountries

  ) { }

  async createCountry(country: CreateCountryDto) {
    return this.createCountryUC.execute(country)
  }

  getAllCountries() {
    return this.getAllCountriesUC.execute()
  }

  getCountryById(id: number) {
    return this.getCountryByIdUC.execute(id)
  }

  async updateCountry(id: number, country: UpdateCountryDto) {
    return this.updateCountryUC.execute(id, country)
  }

  async deleteCountry(id: number) {
    return this.deleteCountryUC.execute(id)
  }

  getCountryCities(id: number) {
    return this.getCountryCitiesUC.execute(id)
  }
}
