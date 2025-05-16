import { IsNotEmpty } from "class-validator"

export class NewCommpanyDTO{
    @IsNotEmpty()
    nombre: string

    @IsNotEmpty()
    rubro: string
}