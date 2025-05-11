import { Country } from "src/countries/domain/model/country.entity";
import { CountryDTO } from "../dto/country.dto";

export class CountryDTOMapper {
    static toDTO (country : Country) : CountryDTO{
        return {
            id: country.getId(),
            descripcion: country.getDescripcion()
        }
    }

    static toDomain(countryDto : CountryDTO) : Country{
        return new Country (countryDto.id, countryDto.descripcion)
    }
}