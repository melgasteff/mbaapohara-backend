import { CityRepository } from "src/cities/domain/repository/city.repository";
import { City } from "src/cities/domain/model/city.entity";
import { CityNotFoundException } from "../exception/city-not-found.exception";
import { Inject, Injectable } from "@nestjs/common";


export class UpdateCityUseCase {
  constructor(

    private readonly cityRepository: CityRepository) { }

  async execute(id: number, city: City): Promise<City> {
    const allCities = await this.cityRepository.getAll();

    const cityFound = allCities.find((city) => city.getId() === id);

    if (!cityFound) { throw new CityNotFoundException(id); }

    return this.cityRepository.update(id, city)
  

  }
}

