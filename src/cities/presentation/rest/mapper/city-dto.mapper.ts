import { City } from "src/cities/domain/model/city.entity";
import { CityDTO } from "../dto/city.dto";

export class CityDTOMapper{
    static toDTO(city: City): CityDTO{
        console.log('dto')
        return { 
            id: city.getId(),
            descripcion: city.getDescripcion(),
            idpais: city.getPais()
        }
    }

    static toDomain(cityDto: CityDTO): City{
        return new City(cityDto.id, cityDto.descripcion, cityDto.idpais)
    }
}