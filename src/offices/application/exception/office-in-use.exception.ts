export class OfficeInUseException extends Error {
    constructor(id:number){
        super(`La sucursal con ID "${id}" no puede ser eliminada porque esta en uso`);
        this.name ='OfficeInUseException'
    }
}