export class NewItem {
    private descripcion: string;
    private idcategory: number

    constructor(descripcion: string, idcategory: number) {
        if (descripcion == null) throw new Error('La descripción es requerida');
        if (idcategory == null) throw new Error("Lacategoría es requerida");
        this.descripcion = descripcion;
        this.idcategory = idcategory

    }
    getDescripcion(): string { return this.descripcion }
    getPais(): number { return this.idcategory }

}