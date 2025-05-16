import {  CityRepository } from "src/cities/domain/repository/city.repository";
import { CityNotFoundException } from "../exception/city-not-found.exception";
import { City } from "src/cities/domain/model/city.entity";
import { Inject, Injectable } from "@nestjs/common";


export class GetCityByIdUseCase {
    constructor(
        private readonly cityRepository: CityRepository
    ) { }

    async execute(id: number): Promise<City> {
        try {
            const cityFound = await this.cityRepository.getById(id)
            if (!cityFound) throw new CityNotFoundException(id)
            return cityFound
        } catch (error) {
            console.error("Error al obtener la ciudad", error);
            throw error;
        }

    }
}