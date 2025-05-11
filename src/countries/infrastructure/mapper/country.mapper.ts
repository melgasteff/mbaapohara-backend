import { Country } from "src/countries/domain/model/country.entity";
import { NewCountry } from "src/countries/domain/model/new-country.entity";
import { CountryTypeORMModel } from "../typeorm/model/country.typeorm.model";

export class CountryMapper{
    static toDomain(countryTypeOrm :CountryTypeORMModel): Country{
        return new Country(countryTypeOrm.id, countryTypeOrm.descripcion)
    }

    static toTypeORMModel(newCountry : NewCountry): CountryTypeORMModel{
        const countryTypeOrm = new CountryTypeORMModel()
        countryTypeOrm.descripcion =newCountry.getDescripcion()
        return countryTypeOrm;
    }
}