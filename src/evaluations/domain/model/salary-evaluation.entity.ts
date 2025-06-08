

export class SalaryEvaluation {
    idEvaluacion: number
    base: string
    experienciaArea: string
    experienciaEmpresa: string
    bono: string
    comision: string
    propina: string
    moneda: string
    frecuencia: string
    modalidad: string

    constructor(
        idEvaluacion: number,
        base: string,
        experienciaArea: string,
        experienciaEmpresa: string,
        bono: string,
        comision: string,
        propina: string,
        moneda: string,
        frecuencia: string,
        modalidad: string
    ) {
        if (base == null) throw new Error('El salario base es requerido');
        if (experienciaArea == null) throw new Error('La experiencia en el area es requerida');
        if (experienciaEmpresa == null) throw new Error('La experiencia en la empresa requerida');
        if (frecuencia == null) throw new Error('La frecuencia de pago es requerida');
        if (modalidad == null) throw new Error('La modalidad de trabajo es requerida')
        this.idEvaluacion = idEvaluacion
        this.base = base
        this.experienciaArea = experienciaArea;
        this.experienciaEmpresa = experienciaEmpresa;
        this.bono = bono
        this.comision = comision
        this.propina = propina;
        this.moneda = moneda;
        this.frecuencia = frecuencia;
        this.modalidad = modalidad;
    }

    getIdEvaluacion(): number { return this.idEvaluacion }
    getBase(): string { return this.base }
    getExperienciaArea(): string { return this.experienciaArea }
    getExperienciaEmpresa(): string { return this.experienciaEmpresa }
    getBono(): string { return this.bono }
    getComision(): string { return this.comision }
    getPropina(): string { return this.propina }
    getMoneda(): string { return this.moneda }
    getFrecuencia(): string { return this.frecuencia }
    getModalidad(): string { return this.modalidad }
}
