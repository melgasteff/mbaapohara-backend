import { IsNotEmpty, IsString } from "class-validator";

export class NewCountryDTO{
    @IsString()
    @IsNotEmpty()
    descripcion : string
}