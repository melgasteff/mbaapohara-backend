import { Provider } from "@nestjs/common";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/count.use-case";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/create.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/delete.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/get-all.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/get-by-id.use-case";
import { UpdateSalaryEvaluatonUseCase } from "src/evaluations/application/use-case/update.use-case";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";

export default <Provider[]>[
    {
        provide: CountSalaryEvaluationsUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new CountSalaryEvaluationsUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },
    {
        provide: CreateSalaryEvaluationUseCase,
        useFactory: (
            salaryEvalRepo: SalaryEvaluationRepository,
            companyRepo :CompanyRepository,
            userRepo:  UserRepository,
            officeRepo: OfficeRepository,
            jobRepo: JobRepository
        ) => new CreateSalaryEvaluationUseCase(
            salaryEvalRepo, companyRepo, userRepo, officeRepo, jobRepo),
        inject: [
            SalaryEvaluationRepository,
            CompanyRepository,
            UserRepository, 
            OfficeRepository, 
            JobRepository
        ]
    },
    {
        provide: GetSalaryEvaluationByIdUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new GetSalaryEvaluationByIdUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },
    {
        provide: DeleteSalaryEvaluationUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new DeleteSalaryEvaluationUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },
    {
        provide: UpdateSalaryEvaluatonUseCase,
        useFactory: (
            salaryEvalRepo: SalaryEvaluationRepository,
            companyRepo :CompanyRepository,
            userRepo:  UserRepository,
            officeRepo: OfficeRepository,
            jobRepo: JobRepository
        ) => new UpdateSalaryEvaluatonUseCase(salaryEvalRepo, companyRepo, userRepo, officeRepo, jobRepo),
        inject: [
            SalaryEvaluationRepository,
            CompanyRepository,
            UserRepository, 
            OfficeRepository, 
            JobRepository
        ]
    },
    {
        provide: GetAllSalaryEvaluationsUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new GetAllSalaryEvaluationsUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },
]