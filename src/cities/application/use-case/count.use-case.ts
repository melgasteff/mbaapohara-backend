import { CityRepository } from "src/cities/domain/repository/city.repository";

export class CountCitiesUseCase {
    constructor(
        private cityRepo: CityRepository
    ){}

    public async execute(): Promise<number> {
        return this.cityRepo.count();
    }
}