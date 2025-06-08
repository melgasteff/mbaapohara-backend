export class UnauthorizedException extends Error{
    constructor(){
        super (`Correo o contraseña inválido`);
        this.name = 'UnauthorizedException';
    }
}