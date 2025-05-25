import { Company } from "src/evaluations/domain/model/company.entity";
import { Job } from "src/evaluations/domain/model/job.entity";
import { Office } from "src/evaluations/domain/model/office.entity";
import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { User } from "src/evaluations/domain/model/user.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationAlreadyExistsException } from "../exception/salary-evaluation-already-exists.exception";
import { NewSalaryEvaluation } from "src/evaluations/domain/model/new-salary-evaluation.entity";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";

export class CreateSalaryEvaluationUseCase {
    constructor(
        private salaryEvlRepo: SalaryEvaluationRepository,
        private companyRepo :CompanyRepository,
        private userRepo:  UserRepository,
        private officeRepo: OfficeRepository,
        private jobRepo: JobRepository
    ) { }

    async execute(
        idjob: number,
        iduser: number,
        idcompany: number,
        idoffice: number,
        base: string,
        experienciaArea: string,
        experienciaEmpresa: string,
        bono: string,
        comision: string,
        propina: string,
        moneda: string,
        frecuencia: string,
        modalidad: string
    ): Promise<SalaryEvaluation> {
        try {
            const allSalaryEvl = await this.salaryEvlRepo.getAll();
            const salaryEvlFound = allSalaryEvl.
                find((salaryEvl) =>
                    salaryEvl.job.getId() === idjob
                    && salaryEvl.office.getId() === idoffice
                    && salaryEvl.user.getId() === iduser
                    && salaryEvl.company.getId() == idcompany
                );

            if (salaryEvlFound) throw new SalaryEvaluationAlreadyExistsException(idoffice, idjob, iduser, idcompany)
            
            const user = await this.userRepo.getById(iduser)
            const office = await this.officeRepo.getById(idoffice)
            const company = await this.companyRepo.getById(idcompany)
            const job = await this.jobRepo.getById(idjob)
            const newSalaryEvl = new NewSalaryEvaluation(
                job,
                user,
                company,
                office,
                base,
                experienciaArea,
                experienciaEmpresa,
                bono,
                comision,
                propina,
                moneda,
                frecuencia,
                modalidad
            )
            return await this.salaryEvlRepo.create(newSalaryEvl)
        } catch (error) {
            console.log("Error al crear la evaluacion de salario: ", error)
            throw error
        }
    }
}