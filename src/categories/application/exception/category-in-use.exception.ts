export class CategoryInUseException extends Error {
    constructor(id: number){
        super(`La Categoria con ID ${id} no se puede eliminar porque está en uso`)
        this.name = 'CategoryInUseException'
    }
}