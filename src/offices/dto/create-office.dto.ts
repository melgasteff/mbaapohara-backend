import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { City } from "src/cities/entities/city.entity"
import { Company } from "src/companies/entities/company.entity"


export class CreateOfficeDto {
    @IsString()
    telefono ?:string

    @IsNumber()
    @IsNotEmpty()
    cantidad_empleados :number

    @IsString()
    @IsEmail()
    email?: string

    @IsString()
    nombre?:string

    @IsNotEmpty()
    empresa :Company

    @IsNotEmpty()
    ciudad: City

}
