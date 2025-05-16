import { IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator"


export class UserDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    nombre: string

    @IsNotEmpty()
    @IsString()
    apellido: string

    @IsNotEmpty()
    @IsString()
    usuario: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'La contraseña debe tener al menos una Mayuscula' })
    @Matches(/[a-z]/, { message: 'La contraseña debe tener al menos una Minuscula' })
    @Matches(/\d/, { message: 'La contraseña debe tener al menos un numero' })
    @Matches(/[\W_]/, { message: 'La contraseña debe tener al menos un caracter especial' })
    contrasenha: string

    @IsNotEmpty()
    idciudad: number

    @IsNotEmpty()
    @IsString()
    tipoUsuario: string

    @IsNotEmpty()
    descripcion: string
}