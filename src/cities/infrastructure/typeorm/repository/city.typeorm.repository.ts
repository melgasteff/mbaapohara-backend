import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityRepository } from 'src/cities/domain/repository/city.repository';
import { City } from 'src/cities/domain/model/city.entity';
import {  CityTypeORMModel } from '../model/city.typeorm.model';
import { NewCity } from 'src/cities/domain/model/new-city.entity';
import { Injectable } from '@nestjs/common';
import { CityMapper } from '../../mapper/city.mapper';

@Injectable()
export class CityTypeORMRepository implements CityRepository {
  
  constructor(
    @InjectRepository(CityTypeORMModel)
    private readonly cityRepo: Repository<CityTypeORMModel>
  ) {}

  async create(newCity: NewCity): Promise<City> {
    const cityTypeOrm = await this.cityRepo.save(CityMapper.toTypeORMModel(newCity))
    return CityMapper.toDomain(cityTypeOrm);
  }

  async getAll(): Promise<City[]> {
    console.log('implementacion repositorio ')
    return (await this.cityRepo.find()).map(cityTypeOrm => CityMapper.toDomain(cityTypeOrm));
  }

  async getById(id: number): Promise<City | null> {
    const cityEntity = await this.cityRepo.findOne({ where: { id } });
    return cityEntity ? CityMapper.toDomain(cityEntity) : null;
  }

  async update(id: number, data: Partial<City>): Promise<City> {
    const existingCity = await this.cityRepo.findOne({ where: { id } });
    if (!existingCity) {
      throw new Error(`City with ID ${id} not found`);
    }

    const updated = Object.assign(existingCity, data);
    const saved = await this.cityRepo.save(updated);
    return CityMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.cityRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.cityRepo.count();
  }
}