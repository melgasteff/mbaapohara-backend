import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class NewOfficeDTO {
    @IsNotEmpty()
    @IsString()
    nombre: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    telefono: string

    @IsNotEmpty()
    @IsNumber()
    cantEmpleados: number

    @IsNotEmpty()
    @IsNumber()
    idCiudad: number

    @IsNotEmpty()
    @IsNumber()
    idempresa: number
}