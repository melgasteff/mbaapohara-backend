import { IsNotEmpty } from "class-validator"

export class EvaluationDetailDTO {
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    idevaluation: number

    @IsNotEmpty()
    iditem: number

    @IsNotEmpty()
    rating: number

    extraReason?: string
}