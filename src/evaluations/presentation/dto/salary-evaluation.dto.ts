import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"

export class SalaryEvaluationDTO {
    idEvaluacion: number
    
    @IsNotEmpty()
    base: string;

    @IsNotEmpty()
    experienciaArea: string;

    @IsNotEmpty()
    experienciaEmpresa: string

    @IsNotEmpty()
    bono: string

    @IsNotEmpty()
    comision: string

    @IsNotEmpty()
    propina: string

    @IsNotEmpty()
    moneda: string

    @IsNotEmpty()
    frecuencia: string

    @IsNotEmpty()
    modalidad: string
}
