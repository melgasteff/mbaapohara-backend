import { CityRepository } from "src/cities/domain/repository/city.repository";
import { CityNotFoundException } from "../exception/city-not-found.exception";
import { Inject, Injectable } from "@nestjs/common";
import { CityInUseException } from "../exception/city-in-use.exception";

export class DeleteCityUseCase {
  constructor(
    private readonly cityRepository: CityRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const city = await this.cityRepository.getById(id);

      if (!city) {throw new CityNotFoundException(id); }

      await this.cityRepository.delete(id);

    } catch (error) {
      if (error instanceof Error && error.message.includes('foreign key'))  throw new CityInUseException(id);
      throw error
    }
  }
}