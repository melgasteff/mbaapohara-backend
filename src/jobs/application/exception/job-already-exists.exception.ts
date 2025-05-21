export class JobAlreadyExistsException extends Error {
    constructor(descripcion: string){
        super(`Ya existe una cargo con la descripcion:  "${descripcion}"`);
        this.name ='JobAlreadyExistsException'
    }
}