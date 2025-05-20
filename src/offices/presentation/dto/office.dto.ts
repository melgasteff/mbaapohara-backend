import { IsNotEmpty } from "class-validator"

export class OfficeDTO{
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    nombre: string

    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    telefono: string

    @IsNotEmpty()
    cantEmpleados: number

    @IsNotEmpty()
    idCiudad: number

    @IsNotEmpty()
    idempresa: number
}