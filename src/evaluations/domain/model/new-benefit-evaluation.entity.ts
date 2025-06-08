import { Benefit } from "./benefit.entity";

export class NewBenefitEvaluation {
    private beneficios: Benefit[];

    constructor(
        beneficios: Benefit[],
    ) {
        if (!beneficios) throw new Error('Los beneficios son requeridos');

        this.beneficios = beneficios;
    }
    getBeneficios(): Benefit[] { return this.beneficios }
}