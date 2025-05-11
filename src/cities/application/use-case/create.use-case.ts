import { City } from '../../domain/model/city.entity';
import { CityRepository } from '../../domain/repository/city.repository';
import { CityAlreadyExistsException } from '../exception/city-already-exists.exception';
import { NewCity } from 'src/cities/domain/model/new-city.entity';

export class CreateCityUseCase {
  constructor(
    private readonly cityRepo: CityRepository
  ) { }

  async execute(descripcion: string, idpais: number): Promise<City> {
    try {
      const allCities = await this.cityRepo.getAll();
      console.log("hasta aca llegue")
      const cityFound = allCities.find((city) => city.getDescripcion().toLowerCase() === descripcion.toLowerCase());
      if (cityFound) throw new CityAlreadyExistsException(descripcion);
      
      const newCiudad = new NewCity(descripcion, idpais);
      return await this.cityRepo.create(newCiudad);

    } catch (error) {
      console.error("Error al crear la ciudad:", error);
      throw error;
    }
  }
}

