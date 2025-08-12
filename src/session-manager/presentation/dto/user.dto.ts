import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator"


export class UserDTO {
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    contrasenha: string
}