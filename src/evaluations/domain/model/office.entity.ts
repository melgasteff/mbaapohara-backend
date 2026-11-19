import { Company } from "./company.entity";

export class Office {
    private id: number;
    private nombre: string
    private idciudad: number
    private empresa: Company

    constructor(id: number, nombre: string, idciudad: number, empresa: Company) {
        if (id == null) throw new Error('El ID es requerido');
        if (nombre == null) throw new Error('El nombre es requerido');
        if (idciudad == null) throw new Error("La ciudad es requerida");
        this.id = id;
        this.nombre = nombre;
        this.empresa = empresa;
        this.idciudad = idciudad
    }
    getId(): number { return this.id }

    getNombre(): string { return this.nombre }

    getEmpresa(): Company { return this.empresa }

    getIdCiudad(): number { return this.idciudad }
}
