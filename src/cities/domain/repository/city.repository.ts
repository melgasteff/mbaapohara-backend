import { City } from '../model/city.entity';
import { NewCity } from '../model/new-city.entity';

export abstract class CityRepository {
  abstract create(newcity: NewCity): Promise<City>;
  abstract getAll(): Promise<City[]>;
  abstract getById(id: number): Promise<City | null>;
  abstract update(id: number, city: Partial<City>): Promise<City>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}
