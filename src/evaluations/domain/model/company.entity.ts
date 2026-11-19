export class Company {
    private id: number;
    private nombre: string;
    private rubro: string;

    constructor(id: number, nombre: string, rubro: string) {
        if (id == null) throw new Error('El ID es requerido');
        if (nombre === null) throw new Error('El nombre e requerido');
        if (rubro == null) throw new Error('El rubro es requerido')
        this.id = id;
        this.nombre = nombre;
        this.rubro = rubro;
    }

    getId(): number{return this.id}
    getNombre():string {return this.nombre}
    getRubro():string {return this.rubro}
}