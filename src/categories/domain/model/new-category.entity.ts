export class NewCategory {
    private description: string

    constructor( description: string) {
        if (description == null) throw new Error('La descipcion es requerida');
        this.description = description
    }

    getDescription(): string { return this.description }
}