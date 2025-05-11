import { isNotEmpty, IsNotEmpty } from "class-validator"

export class CountryDTO{
    @IsNotEmpty()
    id: number
    @IsNotEmpty()
    descripcion: string
}