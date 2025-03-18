import { HttpException, HttpStatus } from "@nestjs/common"
import { CreateUserDto } from "../dto/create-user.dto"

export function validatePass(user: CreateUserDto) {

    const pass = user.contrasena
    const lowerPass = pass.toLowerCase()
    const lowerName = (user.nombre).toLowerCase()
    const lowerLast = (user.apellido).toLowerCase()
    const lowerUsername = (user.usuario).toLowerCase()
    const secuences = /(1234|2345|3456|4567|5678|6789|7890)/;

    if (secuences.test(pass))
        throw new HttpException('La contraseña no debe contener una secuencia numerica', HttpStatus.BAD_REQUEST);

    if (lowerPass.includes(lowerName))
        throw new HttpException('La contraseña no debe contener tu nombre', HttpStatus.BAD_REQUEST);

    if (lowerPass.includes(lowerLast))
        throw new HttpException('La contraseña no debe contener tu apellido', HttpStatus.BAD_REQUEST);

    if (lowerPass.includes(lowerUsername))
        throw new HttpException('La contraseña no debe contener tu nombre de usuario', HttpStatus.BAD_REQUEST);

    return user
}