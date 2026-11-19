export class User {
    private id: number;
    private email: string;

    constructor(id: number, email: string) {
        if (id == null) throw new Error('El id es requerido');
        this.id = id;
        this.email = email;
    }

    getId(): number {return this.id; }

    getEmail(): string {return this.email; }
}
