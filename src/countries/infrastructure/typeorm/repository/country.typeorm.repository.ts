import { Injectable } from "@nestjs/common";
import { Country } from "src/countries/domain/model/country.entity";
import { NewCountry } from "src/countries/domain/model/new-country.entity";
import { CountryRepository } from "src/countries/domain/repository/country.repository";
import { Repository } from "typeorm";
import { CountryTypeORMModel } from "../model/country.typeorm.model";
import { CountryMapper } from "../../mapper/country.mapper";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CountryTypeORMRepository implements CountryRepository {
    
    constructor(
        @InjectRepository(CountryTypeORMModel)
        private readonly countryRepo: Repository<CountryTypeORMModel>
    ) { }
    async create(newCountry: NewCountry): Promise<Country> {
        const countryTypeOrm = await this.countryRepo.save(CountryMapper.toTypeORMModel(newCountry))
        return CountryMapper.toDomain(countryTypeOrm)
    }

    async getAll(): Promise<Country[]> {
        return (await this.countryRepo.find()).map(countryTypeOrm => CountryMapper.toDomain(countryTypeOrm))
    }

    async getById(id: number): Promise<Country> {
        const countryTypeOrm = await this.countryRepo.findOneBy({ id })
        return countryTypeOrm ? CountryMapper.toDomain(countryTypeOrm) : null
    }

    async update(id: number, country: Partial<Country>): Promise<Country> {
        const countryFound = await this.countryRepo.findOneBy({ id });
        const updatedCountry = Object.assign(countryFound, country);
        const savedCountry = await this.countryRepo.save(updatedCountry);
        return CountryMapper.toDomain(savedCountry);
    }
    async delete(id: number): Promise<void> {
        await this.countryRepo.delete(id)
    }
    count(): Promise<number> {
        return this.countryRepo.count();
    }

}