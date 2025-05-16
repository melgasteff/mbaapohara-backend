export class UserAlreadyExistsException extends Error{
    constructor(usuario: string){
        console.log("hola hola")
        super (`Ya existe un usuario con ese nombre: "${usuario}"`);
        this.name = 'UserAlreadyExistsException';
    }
}