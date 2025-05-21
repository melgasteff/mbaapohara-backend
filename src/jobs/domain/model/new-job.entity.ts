export class NewJob {
    private descripcion

    constructor( descripcion: string) {
        if (descripcion === null) throw new Error('La descripcion es requerida')
        this.descripcion = descripcion
    }

    getDescripcion(): string { return this.descripcion }
}