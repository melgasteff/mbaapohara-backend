import { Company } from "./ company.entity";

export class NewOffice {
    private nombre: string
    private email: string
    private telefono: string
    private cantEmpleados: number
    private idciudad: number
    private empresa: Company

    constructor( nombre: string, email: string, telefono: string, cantEmpleados: number, idciudad: number, empresa: Company) {
        if (nombre == null) throw new Error('El nombre es requerido');
        if (email == null) throw new Error("El email es requerido");
        if (telefono == null) throw new Error("El telefono es requerido");
        if (idciudad == null) throw new Error("El email es requerido");
        if (email == null) throw new Error("El email es requerido");
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.cantEmpleados = cantEmpleados;
        this.empresa = empresa;
        this.idciudad = idciudad

    }

    getNombre(): string { return this.nombre }

    getEmail(): string { return this.email }

    getTelefono(): string { return this.telefono }

    getEmpresa(): Company { return this.empresa }

    getIdCiudad(): number { return this.idciudad }

    getCantEmpleados(): number { return this.cantEmpleados }


}