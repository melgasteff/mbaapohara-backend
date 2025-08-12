
export class NewReason {
    private description: string
    private rating: number
    private deleted: boolean = false

    constructor(description: string, rating: number, deleted?: boolean) {
        if (description === null || description === undefined) throw new Error("La descripcion es requerida")
        if (rating === null || rating === undefined) throw new Error("La calificaicon es requerida")
        if (deleted) { this.deleted = deleted }
        this.description = description
        this.rating = rating

    }

    getDescription(): string { return this.description }
    getRating(): number { return this.rating }
    isDeleted(): boolean { return this.deleted }
}