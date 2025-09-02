import { IsNotEmpty } from "class-validator"

export class NewEvaluationDetailDTO {

    @IsNotEmpty()
    idevaluation: number

    @IsNotEmpty()
    iditem: number

    @IsNotEmpty()
    rating: number

    extraReason?: string
}