export class CategoryAlreadyExistsException extends Error {
    constructor(descripcion: string) {
        super(`Ya existe una categoria con la descripcion: ${descripcion}`);
        this.name = 'CategoryAlreadyExistsException'
    }
}