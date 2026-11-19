import { City } from '../../domain/model/city.entity';
import { CityRepository } from '../../domain/repository/city.repository';
import { CityAlreadyExistsException } from '../exception/city-already-exists.exception';
import { NewCity } from 'src/cities/domain/model/new-city.entity';

export class CreateCityUseCase {
  constructor(
    private readonly cityRepo: CityRepository
  ) { }

  async execute(descripcion: string, idpais: number): Promise<City> {
    const allCities = await this.cityRepo.getAll();
    const cityFound = allCities.find((city) => city.getDescripcion().toLowerCase() === descripcion.toLowerCase());
    if (cityFound) throw new CityAlreadyExistsException(descripcion);
    
    const newCiudad = new NewCity(descripcion, idpais);
    return await this.cityRepo.create(newCiudad);

  
  }
}

