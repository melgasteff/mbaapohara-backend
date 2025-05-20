export class OfficeAlreadyExistsException extends Error {
    constructor(nombre: string){
        super(`Ya existe una sucursal con el nombre "${nombre}"`);
        this.name ='OfficeAlreadyExistsException'
    }
}