import { IsNotEmpty, IsNumber } from "class-validator"

export class NewEvaluationDetailDTO {

    @IsNotEmpty()
    @IsNumber()
    idevaluation: number

    @IsNotEmpty()
    @IsNumber()
    iditem: number

    @IsNotEmpty()
    @IsNumber()
    rating: number

    extraReason?: string
}