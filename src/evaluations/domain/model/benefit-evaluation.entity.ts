import { Benefit } from "./benefit.entity";

export class BenefitEvaluation {
    private idEvaluacion: number;
    private beneficios: Benefit[];

    constructor(
        idEvaluacion: number,
        beneficios: Benefit[],
    ) {
        if (!beneficios) throw new Error('Los beneficios son requeridos');
        this.idEvaluacion= idEvaluacion
        this.beneficios = beneficios;
    }
    getIdEvaluacion(): number {return this.idEvaluacion}
    getBeneficios(): Benefit[] { return this.beneficios }
}