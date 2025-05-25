import { Company } from "./company.entity";
import { Job } from "./job.entity";
import { Office } from "./office.entity";

import { User } from "./user.entity";

export class Evaluation {
    id: number
    job: Job
    user: User;
    company: Company;
    office: Office
    //salaryEvl: SalaryEvl
    //benefitsEvl : CompanyReview

    constructor(id: number, job: Job, user: User, company: Company, office: Office) {
        if (id == null) throw new Error('El id es requerido');
        if (job == null) throw new Error('El cargo es requerido');
        if (user == null) throw new Error('El usuario es requerido');
        if (company == null) throw new Error('La empresa es requerida');
        if (office == null) throw new Error('La sucursal es requerida');
        this.id = id;
        this.job = job;
        this.company = company;
        this.office= office;
        //this.salaryEvl= salaryEvl;
    }

    getId():number{console.log("evaluationnn");return this.id}
    getJob():Job {return this.job}
    getUser():User{return this.user}
    getCompany():Company{return this.company}
    getOffice(): Office{return this.office}
    //getSalaryEvl():SalaryEvl{return this.salaryEvl}
}
