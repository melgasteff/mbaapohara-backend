import { Country } from "../model/country.entity";
import { NewCountry } from "../model/new-country.entity";

export abstract class CountryRepository{
    abstract create(newCountry : NewCountry): Promise<Country>
    abstract getAll(): Promise<Country[]>
    abstract getById(id: number): Promise<Country>
    abstract update(id:number, country: Partial<Country>): Promise<Country>
    abstract delete(id: number): Promise<void>
    abstract count(): Promise<number>
}