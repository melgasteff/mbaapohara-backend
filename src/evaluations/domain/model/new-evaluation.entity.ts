import { Company } from "./ company.entity"
import { Job } from "./job.entity"
import { Office } from "./office.entity"
import { User } from "./user.entity"

export class NewEvaluation {
    private user: User
    private job: Job
    private office: Office
    private company: Company
    private desde: Date
    private hasta: Date

    constructor(
        user: User,
        job: Job,
        office: Office,
        company: Company,
        desde: Date,
        hasta: Date
    ) {
        if (user == null) throw new Error("El usuario es requerido")
        if (job == null) throw new Error("El cargo es requerido")
        if (office == null) throw new Error("La sucursal es requerida")
        if (company == null) throw new Error("La empresa es requerida")
        if (desde == null) throw new Error("La fecha inicial es requerida")
        if (hasta == null) throw new Error("La fecha final es requerida")

        this.user = user
        this.job = job
        this.office = office
        this.company = company
        this.desde = desde
        this.hasta = hasta
    }

    getUser(): User { return this.user }
    getJob(): Job { return this.job }
    getOffice(): Office { return this.office }
    getCompany(): Company { return this.company }
    getDesde(): Date { return this.desde }
    getHasta(): Date { return this.hasta }

}