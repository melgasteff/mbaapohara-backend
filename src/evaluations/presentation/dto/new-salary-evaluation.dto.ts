import { IsNotEmpty } from "class-validator";

export class NewSalaryEvaluationDTO {

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
