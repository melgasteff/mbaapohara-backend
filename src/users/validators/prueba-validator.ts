import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { CreateUserDto } from "../dto/create-user.dto";

@ValidatorConstraint({ name: 'PassValidator', async: false })
export class PassValidator implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments): boolean {
        const user = args.object as CreateUserDto;

        if (!password || !user) return false;

        const lowerPass = password.toLowerCase();
        const lowerName = user.nombre.toLowerCase();
        const lowerLast = user.apellido.toLowerCase();
        const lowerUsername = user.usuario.toLowerCase();
        const secuences = /(1234|2345|3456|4567|5678|6789|7890)/;

        if (secuences.test(password)) return false;
        if (lowerPass.includes(lowerName)) return false;
        if (lowerPass.includes(lowerLast)) return false;
        if (lowerPass.includes(lowerUsername)) return false;

        return true; 
    }

    defaultMessage(args: ValidationArguments): string {
        return 'La contraseña no debe contener datos personales ni secuencias numéricas comunes';
    }
}