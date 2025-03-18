import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, MaxLength } from "class-validator"
import { User } from "src/users/entities/user.entity"

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(1)
    activo: string

    @IsNumber()
    @IsNumber()
    @Max(5)
    calificacion: number

    @IsString()
    @IsNotEmpty()
    telefono: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    rubro: string

    @IsString()
    @IsNotEmpty()
    servicio: string

    @IsNotEmpty()
    autor: User
}
