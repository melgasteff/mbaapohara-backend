

export class User {
    private id: number;
    private nombre: string
    private apellido: string;
    private usuario: string
    private email: string;
    private contrasenha: string;
    private idciudad: number;
    private tipoUsuario: string;
    private descripcion: string;

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        usuario: string,
        email: string,
        contrasenha: string,
        idciudad: number,
        tipoUsuario: string,
        descripcion: string
    ) {
        console.log('en el domain user', nombre, apellido, usuario, email, contrasenha, idciudad, tipoUsuario, descripcion)
        if (id == null) throw new Error('El id es requerido');
        if (nombre == null) throw new Error('El nombre es requerido');
        if (apellido == null) throw new Error('El apellido es requerido');
        if (usuario == null) throw new Error('El usuario es requerido');
        if (email == null) throw new Error('El email es requerido');
        if (contrasenha == null) throw new Error('La contraseña es requerida');
        if (idciudad == null) throw new Error('La ciudad es requerida');
        if (tipoUsuario == null) throw new Error('El tipo de usuario es requerido');
        // if (descripcion == null) throw new Error('La descripción es requerida');
        this.id = id;
        this.nombre=nombre;
        this.apellido=apellido;
        this.usuario =usuario;
        this.email=email;
        this.contrasenha=contrasenha;
        this.idciudad=idciudad;
        this.tipoUsuario=tipoUsuario;
        this.descripcion=descripcion;
        console.log("descripcion de user",descripcion)
    }

    getId(): number {console.log('usuer', this.id); return this.id;}

    getNombre(): string {return this.nombre; }

    getApellido(): string {return this.apellido;}

    getUsuario(): string {return this.usuario;}

    getEmail(): string {return this.email; }

    getContrasenha(): string {return this.contrasenha;}

    getCiudad(): number {return this.idciudad;}

    getTipoUsuario(): string {return this.tipoUsuario; }

    getDescripcion(): string {return this.descripcion; }

}