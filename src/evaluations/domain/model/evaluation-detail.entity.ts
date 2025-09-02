import { Evaluation } from "./evauation.entity"
import { Item } from "./item.entity"

export class EvaluationDetail {
    private id: number
    private evaluation: Evaluation
    private item: Item
    private rating: number
    private extraReason?: string

    constructor(
        id: number,
        evaluation: Evaluation,
        item: Item,
        rating: number,
        extraReason?: string,
    ) {
        if (id == null) throw new Error("El ID es requerido")
        if (evaluation == null) throw new Error("La evaluacion es requerida")
        if (item == null) throw new Error("El item es requerido")
        if (rating == null) throw new Error("La calificaion es requerida")

        this.id = id
        this.evaluation = evaluation
        this.item = item
        this.rating = rating
        this.extraReason = extraReason

    }

    getId(): number { return this.id }
    getEvaluation(): Evaluation { return this.evaluation }
    getItem(): Item { return this.item }
    getRating(): number { return this.rating }
    getExtraReason(): string { return this.extraReason }

}