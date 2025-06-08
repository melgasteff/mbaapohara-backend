import { Company } from "./company.entity";

export class Office {
    private id: number;
    private nombre: string
    private email: string
    private telefono: string
    private cantEmpleados: number
    private idCiudad: number
    private empresa: Company

    constructor(id: number, nombre: string, email: string, telefono: string, cantEmpleados: number, idCiudad: number, empresa: Company) {
        if (id == null) throw new Error('El ID es requerido');
        if (nombre == null) throw new Error('El nombre es requerido');
        if (email == null) throw new Error("El email es requerido");
        if (telefono == null) throw new Error("El telefono es requerido");
        if (idCiudad == null) throw new Error("El idCiudad es requerido");
        if (empresa == null) throw new Error("La empresa es requerida");
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.cantEmpleados = cantEmpleados;
        this.empresa = empresa;
        this.idCiudad = idCiudad

    }
    getId(): number {return this.id }

    getNombre(): string { return this.nombre }

    getEmail(): string { return this.email }

    getTelefono(): string { return this.telefono }

    getEmpresa(): Company { return this.empresa }

    getIdCiudad(): number { return this.idCiudad }

    getCantEmpleados(): number { return this.cantEmpleados }


}