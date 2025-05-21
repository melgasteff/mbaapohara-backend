export class JobNotFoundException extends Error {
    constructor(id: number){
        super(`No se ha encontrado ningun cargo con ID:  "${id}"`);
        this.name ='JobNotFoundException'
    }
}