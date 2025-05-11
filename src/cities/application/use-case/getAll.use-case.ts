import { City } from "src/cities/domain/model/city.entity";
import { CityRepository } from "src/cities/domain/repository/city.repository";

export class GetAllCitiesUseCase {
    
    constructor(
        private cityRepo: CityRepository
    ){}

    public async execute(): Promise<City[]>{
        console.log('caso de uso')
        return this.cityRepo.getAll();
    }
}