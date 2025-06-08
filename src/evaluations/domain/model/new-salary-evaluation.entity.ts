import { Company } from "./company.entity";
import { Job } from "./job.entity";
import { Office } from "./office.entity";
import { User } from "./user.entity";

export class NewSalaryEvaluation {
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