export class NewCompany {
    private nombre: string;
    private rubro: string;

    constructor( nombre: string, rubro: string) {
        if (nombre === null) throw new Error('El nombre e requerido');
        if (rubro == null) throw new Error('El rubro es requerido')
        this.nombre = nombre;
        this.rubro = rubro;
    }

    getNombre():string {return this.nombre}
    getRubro():string {return this.rubro}
}