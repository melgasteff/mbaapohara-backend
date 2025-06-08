export class Contract {
    id: number;
    descripcion: string

    constructor(
        id: number,
        descripcion: string
    ) {
        if (id == null) throw new Error('El id es requerido');
        if (descripcion == null) throw new Error('La descripcion es requerida');
        this.id = id;
        this.descripcion = descripcion
    }
    getId(): number {return this.id }
    getTipoContrato(): string { return this.descripcion }
}