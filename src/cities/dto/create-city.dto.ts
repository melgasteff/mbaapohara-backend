import { IsNotEmpty, IsString } from "class-validator";
import { Country } from "src/countries/entities/country.entity";

export class CreateCityDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string 

    @IsNotEmpty()
    pais: Country
}
