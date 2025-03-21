import { IsNotEmpty, isNotEmpty } from "class-validator"

export class CreateSalaryEvlDto {
    base :string
    experiencia_area : string
    experiencia_empresa : string
    bono : string
    comision :string
    propina : string
    moneda : string
    frecuencia : string
    modalidad: string

    @IsNotEmpty()
    id_evaluacion:number
}