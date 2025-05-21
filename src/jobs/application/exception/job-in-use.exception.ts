export class JobInUseException extends Error {
    constructor(id: number){
        super(`No se puede eliminar el cargo con ID: "${id}" porque esta en uso`);
        this.name ='JobInUseException'
    }
}