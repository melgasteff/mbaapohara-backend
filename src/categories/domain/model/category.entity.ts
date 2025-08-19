export class Category {
    private id: number
    private description: string

    constructor(id: number, description: string) {
        if (id === null) throw new Error('El ID es requerido');
        if (description === null) throw new Error('La descipcion es requerida');
        this.id = id
        this.description= description
    }

    getId(): number { return this.id }
    getDescription(): string { return this.description }
}