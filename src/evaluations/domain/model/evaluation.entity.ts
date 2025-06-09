import { Benefit } from "./benefit.entity";
import { Company } from "./company.entity";
import { Contract } from "./contract.entity";
import { Job } from "./job.entity";
import { Office } from "./office.entity";
import { SalaryEvaluation } from "./salary-evaluation.entity";
import { User } from "./user.entity";

export class Evaluation {
    id: number
    job: Job
    user: User;
    company: Company
    office: Office
    desde: Date
    hasta: Date
    contrato!: Contract
    salaryEvaluation!: SalaryEvaluation
    benefits: Benefit[] = []

    constructor(
        id: number,
        job: Job,
        user: User,
        company: Company,
        office: Office,
        desde: Date,
        hasta: Date
    ) {
        if (id == null) throw new Error('El id es requerido');
        if (job == null) throw new Error('El cargo es requerido');
        if (user == null) throw new Error('El usuario es requerido');
        if (company == null) throw new Error('La empresa es requerida');
        if (office == null) throw new Error('La sucursal es requerida');
        if (desde == null) throw new Error('La fecha desde es requerida');
        if (hasta == null) throw new Error('La fecha hasta es requerida');

        this.id = id;
        this.job = job;
        this.company = company;
        this.office = office;
        this.user = user;
        this.desde = desde;
        this.hasta = hasta;
    }

    setContrato(contrato: Contract){ this.contrato = contrato}
    setSalaryEvaluation(salaryEval: SalaryEvaluation){ this.salaryEvaluation = salaryEval }
    addBenefit(benefit: Benefit){ this.benefits.push(benefit) }
    addBenefits(benefits: Benefit[]){ this.benefits = this.benefits.concat(benefits) }

    getId(): number { return this.id }
    getJob(): Job { return this.job }
    getUser(): User { return this.user }
    getCompany(): Company { return this.company }
    getOffice(): Office { return this.office }
    getDesde(): Date { return this.desde }
    getHasta(): Date { return this.hasta }
    getContrato(): Contract | null { return this.contrato ?? null}
    getSalaryEvaluation(): SalaryEvaluation | null { return this.salaryEvaluation ?? null}
    getBenefits(): Benefit[] { return this.benefits }
}
