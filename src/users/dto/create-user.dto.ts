import { IsEmail, IsNotEmpty, isString, IsString, Matches, MinLength, Validate } from "class-validator"
import { City } from "src/cities/entities/city.entity"
import { PassValidator } from "../validators/prueba-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    apellido: string

    @IsString()
    @IsNotEmpty()
    usuario: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    @Matches(/[A-Z]/, {message: 'La contraseña debe tener al menos una Mayuscula'})
    @Matches(/[a-z]/, {message: 'La contraseña debe tener al menos una Minuscula'})
    @Matches(/\d/, {message: 'La contraseña debe tener al menos un numero'})
    @Matches(/[\W_]/, {message: 'La contraseña debe tener al menos un caracter especial'})
    //@Validate(PassValidator)
    contrasena: string

    @IsString()
    @IsNotEmpty()
    tipo_usuario: string

    @IsNotEmpty()
    ciudad: City

    @IsString()
    descripcion : string
}
