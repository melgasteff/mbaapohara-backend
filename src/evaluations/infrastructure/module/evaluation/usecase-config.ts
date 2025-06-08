import { Provider } from "@nestjs/common";
import { CountBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/count.use-case";
import { CreateBenefitEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/create.use-case";
import { DeleteBenefitsEvaluationUseCase } from "src/evaluations/application/use-case/benefit-evaluation/delete.use-case";
import { GetAllBenefitEvaluationsUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-all.use-case";
import { GetBenefitEvaluationByIdUseCase } from "src/evaluations/application/use-case/benefit-evaluation/get-by-id.use-case";
import { UpdateBenefitEvaluatonUseCase } from "src/evaluations/application/use-case/benefit-evaluation/update.use-case";
import { CountEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/count.use-case";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { CountSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/count.use-case";
import { CreateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/create.use-case";
import { DeleteSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/delete.use-case";
import { GetAllSalaryEvaluationsUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-all.use-case";
import { GetSalaryEvaluationByIdUseCase } from "src/evaluations/application/use-case/salary-evaluation/get-by-id.use-case";
import { UpdateSalaryEvaluationUseCase } from "src/evaluations/application/use-case/salary-evaluation/update.use-case";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";

export default <Provider[]>[
    {
        provide: CountEvaluationsUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new CountEvaluationsUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: CreateEvaluationUseCase,
        useFactory: (
            evaluationRepo: EvaluationRepository,
            companyRepo: CompanyRepository,
            userRepo: UserRepository,
            officeRepo: OfficeRepository,
            jobRepo: JobRepository,
            contractRepo: ContractRepository
        ) => new CreateEvaluationUseCase(
            evaluationRepo, jobRepo, userRepo, companyRepo, officeRepo, contractRepo),
        inject: [
            EvaluationRepository,
            CompanyRepository,
            UserRepository,
            OfficeRepository,
            JobRepository,
            ContractRepository
        ]
    },
    {
        provide: GetEvaluationByIdUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new GetEvaluationByIdUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: DeleteEvaluationUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new DeleteEvaluationUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: UpdateEvaluationUseCase,
        useFactory: (
            evaluationRepo: EvaluationRepository,
            companyRepo: CompanyRepository,
            userRepo: UserRepository,
            officeRepo: OfficeRepository,
            jobRepo: JobRepository,
            contractRepo: ContractRepository
        ) => new UpdateEvaluationUseCase(evaluationRepo, jobRepo, userRepo, companyRepo, officeRepo, contractRepo),
        inject: [
            EvaluationRepository,
            CompanyRepository,
            UserRepository,
            OfficeRepository,
            JobRepository,
            ContractRepository
        ]
    },
    {
        provide: GetAllEvaluationsUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new GetAllEvaluationsUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    //Salario
    {
        provide: CountSalaryEvaluationsUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new CountSalaryEvaluationsUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },
    {
        provide: CreateSalaryEvaluationUseCase,
        useFactory: (
            salaryEvalRepo: SalaryEvaluationRepository,
            evaluationRepo: EvaluationRepository
        ) => new CreateSalaryEvaluationUseCase(
            salaryEvalRepo, evaluationRepo),
        inject: [
            SalaryEvaluationRepository,
            EvaluationRepository
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
        provide: UpdateSalaryEvaluationUseCase,
        useFactory: (
            salaryEvalRepo: SalaryEvaluationRepository,
        ) => new UpdateSalaryEvaluationUseCase(salaryEvalRepo),
        inject: [
            SalaryEvaluationRepository,
        ]
    },
    {
        provide: GetAllSalaryEvaluationsUseCase,
        useFactory: (salaryEvalRepo: SalaryEvaluationRepository) => new GetAllSalaryEvaluationsUseCase(salaryEvalRepo),
        inject: [SalaryEvaluationRepository]
    },

    //Beneficios
    {
        provide: CountBenefitEvaluationsUseCase,
        useFactory: (benefitEvaluationRepo: BenefitEvaluationRepository) => new CountBenefitEvaluationsUseCase(benefitEvaluationRepo),
        inject: [BenefitEvaluationRepository]
    },
    {
        provide: CreateBenefitEvaluationUseCase,
        useFactory: (
            benefitEvaluationRepo: BenefitEvaluationRepository,
            evaluationRepo: EvaluationRepository,
        ) => new CreateBenefitEvaluationUseCase(benefitEvaluationRepo, evaluationRepo),
        inject: [
            BenefitEvaluationRepository,
            EvaluationRepository
        ]
    },
    {
        provide: GetBenefitEvaluationByIdUseCase,
        useFactory: (benefitEvaluationRepo: BenefitEvaluationRepository) => new GetBenefitEvaluationByIdUseCase(benefitEvaluationRepo),
        inject: [BenefitEvaluationRepository]
    },
    {
        provide: DeleteBenefitsEvaluationUseCase,
        useFactory: (BenefitEvaluationRepo: BenefitEvaluationRepository) => new DeleteBenefitsEvaluationUseCase(BenefitEvaluationRepo),
        inject: [BenefitEvaluationRepository]
    },
    {
        provide: UpdateBenefitEvaluatonUseCase,
        useFactory: (
            benefitEvaluationRepo: BenefitEvaluationRepository
        ) => new UpdateBenefitEvaluatonUseCase(benefitEvaluationRepo),
        inject: [
            BenefitEvaluationRepository
        ]
    },
    {
        provide: GetAllBenefitEvaluationsUseCase,
        useFactory: (benefitEvaluationRepo: BenefitEvaluationRepository) => new GetAllBenefitEvaluationsUseCase(benefitEvaluationRepo),
        inject: [BenefitEvaluationRepository]
    },
]