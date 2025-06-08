import { Company } from "src/evaluations/domain/model/company.entity";
import { Job } from "src/evaluations/domain/model/job.entity";
import { Office } from "src/evaluations/domain/model/office.entity";
import { SalaryEvaluation } from "src/evaluations/domain/model/salary-evaluation.entity";
import { User } from "src/evaluations/domain/model/user.entity";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationAlreadyExistsException } from "../../exception/salary-evaluation/salary-evaluation-already-exists.exception";
import { NewSalaryEvaluation } from "src/evaluations/domain/model/new-salary-evaluation.entity";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { identity } from "rxjs";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";

export class CreateSalaryEvaluationUseCase {
    constructor(
        private salaryEvlRepo: SalaryEvaluationRepository,
        private evaluationRepo: EvaluationRepository
    ) { }

    async execute(
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
    ): Promise<SalaryEvaluation> {
        try {
            const evaluation = await this.evaluationRepo.getById(idEvaluacion)

            if (!evaluation) throw new EvaluationNotFoundException(idEvaluacion)

            const newSalaryEvl = new NewSalaryEvaluation(
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
            return await this.salaryEvlRepo.create(idEvaluacion, newSalaryEvl)
        } catch (error) {
            console.log("Error al crear la evaluacion de salario: ", error)
            throw error
        }
    }
}