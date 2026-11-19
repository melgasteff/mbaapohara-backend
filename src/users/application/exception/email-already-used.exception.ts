export class EmailAlreadyUsedException extends Error{
    constructor(email: string){
        super (`Ya existe un usuario con ese email: "${email}"`);
        this.name = 'EmailAlreadyUsedException';
    }
}