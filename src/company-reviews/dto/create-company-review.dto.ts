import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator"

export class CreateCompanyReviewDto {
    @IsBoolean()
    activo: boolean

    @IsNumber()
    calificacion: number
    pros: string
    contras: string
    consejo: string
    modaildad: string
    titulo: string

    @IsNotEmpty()
    id_evaluacion: number
}
