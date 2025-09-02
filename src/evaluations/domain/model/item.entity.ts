export class Item {
    private id: number;
    private descripcion: string;
    private idcategory: number

    constructor(id: number, descripcion: string, idcategory: number) {
        if (id == null) throw new Error('El ID es requerido');
        if (descripcion == null) throw new Error('La descripción es requerida');
        if (idcategory == null) throw new Error("Lacategoría es requerida");
        this.id = id;
        this.descripcion = descripcion;
        this.idcategory = idcategory

    }

    getDescripcion(): string { return this.descripcion }
    getId(): number { return this.id }
    getCategory(): number { return this.idcategory }

}
