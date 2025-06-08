import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator"


export class UserDTO {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'La contraseña debe tener al menos una Mayuscula' })
    @Matches(/[a-z]/, { message: 'La contraseña debe tener al menos una Minuscula' })
    @Matches(/\d/, { message: 'La contraseña debe tener al menos un numero' })
    @Matches(/[\W_]/, { message: 'La contraseña debe tener al menos un caracter especial' })
    contrasenha: string
}