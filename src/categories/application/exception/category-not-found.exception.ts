export class CategoryNotFoundException extends Error {
    constructor(id: number){
        super(`No se ha encontrado la Cateogria con ID ${id}`)
        this.name = 'CategoryNotFoundException'
    }
}