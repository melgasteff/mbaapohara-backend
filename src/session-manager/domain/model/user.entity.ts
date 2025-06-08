

export class User {
    private email: string;
    private contrasenha: string;

    constructor(
        email: string,
        contrasenha: string,
    ) {
        if (email == null) throw new Error('El email es requerido');
        if (contrasenha == null) throw new Error('La contraseña es requerida');
        this.email=email;
        this.contrasenha=contrasenha;
    }
    getEmail(): string {return this.email; }
    getContrasenha(): string {return this.contrasenha;}

}