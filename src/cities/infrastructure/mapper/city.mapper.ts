import { City } from "src/cities/domain/model/city.entity";
import { CityTypeORMModel } from "../typeorm/model/city.typeorm.model";
import { NewCity } from "src/cities/domain/model/new-city.entity";

export class CityMapper{
    static toDomain(cityTypeOrm: CityTypeORMModel): City{
        return new City(cityTypeOrm.id, cityTypeOrm.descripcion, cityTypeOrm.idpais);
    }

    static toTypeORMModel(newCiudad: NewCity): CityTypeORMModel{
        const cityTypeORM = new CityTypeORMModel();
        cityTypeORM.descripcion = newCiudad.getDescripcion();
        cityTypeORM.idpais = newCiudad.getPais();
        return cityTypeORM;
    }
}