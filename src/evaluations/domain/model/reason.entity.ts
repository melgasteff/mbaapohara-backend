
export class Reason {
    private id: number
    private description: string
    private rating: number
    private deleted: boolean = false

    constructor(id: number, description: string, rating: number, deleted: boolean = false) {
        if (id === null || id === undefined) throw new Error("El ID es requerido")
        if (description === null || description === undefined) throw new Error("La descripcion es requerida")
        if (rating === null || rating === undefined) throw new Error("La calificaicon es requerida")
        if (deleted) { this.deleted = deleted }
        this.id = id
        this.description = description
        this.rating = rating

    }

    getId(): number { return this.id }
    getDescription(): string { return this.description }
    getRating(): number { return this.rating }
    isDeleted(): boolean { return this.deleted }
}