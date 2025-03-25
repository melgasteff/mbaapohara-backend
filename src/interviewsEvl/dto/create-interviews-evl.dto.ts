import { IsNotEmpty } from "class-validator"

export class CreateInterviewsEvlDto {
    calificacion  : number

    dificultad : string

    @IsNotEmpty()
    id_evaluacion : number
}
