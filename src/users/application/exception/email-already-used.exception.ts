export class EmailAlreadyUsedException extends Error{
    constructor(email: string){
        console.log("hola hola")
        super (`Ya existe un usuario con ese email: "${email}"`);
        this.name = 'EmailAlreadyUsedException';
    }
}