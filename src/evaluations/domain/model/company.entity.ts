export class Company {
    private id: number;
    private nombre: string;

    constructor(id: number, nombre: string) {
        if (id == null) throw new Error('El ID es requerido');
        if (nombre === null) throw new Error('El nombre e requerido');
        this.id = id;
        this.nombre = nombre;
    }

    getId(): number{return this.id}
    getNombre():string {return this.nombre}
}
