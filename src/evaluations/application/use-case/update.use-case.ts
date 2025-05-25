import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationNotFoundException } from "../exception/salary-evaluation-not-found.exception";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";


export class UpdateSalaryEvaluatonUseCase {
  constructor(
    private readonly salaryEvlRepo: SalaryEvaluationRepository,
    private companyRepo: CompanyRepository,
    private userRepo: UserRepository,
    private officeRepo: OfficeRepository,
    private jobRepo: JobRepository
  ) { }

  async execute(
    id: number,
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

      const salaryEvlFound = allSalaryEvl.find((salaryEvl) => salaryEvl.getId() === id);

      if (!salaryEvlFound) { throw new SalaryEvaluationNotFoundException(id) }

      const user = await this.userRepo.getById(iduser)
      const office = await this.officeRepo.getById(idoffice)
      const company = await this.companyRepo.getById(idcompany)
      const job = await this.jobRepo.getById(idjob)
      const salaryEvlToUpdate = new SalaryEvaluation(
        id,
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
      return this.salaryEvlRepo.update(id, salaryEvlToUpdate)
    } catch (error) {
      console.error("Error al actualizar la evaluacion de salario:", error);
      throw new error
    }

  }
}