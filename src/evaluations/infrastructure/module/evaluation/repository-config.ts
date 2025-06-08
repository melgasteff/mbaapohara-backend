import { Provider } from "@nestjs/common";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { OfficeTypeORMRepository } from "../../typeorm/repository/office.typeorm.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { UserTypeORMRepository } from "../../typeorm/repository/user.typeorm.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { CompanyTypeORMRepository } from "../../typeorm/repository/company.typeorm.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { JobTypeORMRepository } from "../../typeorm/repository/job.typeorm.repository";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationTypeORMRepository } from "../../typeorm/repository/evaluation.typeorm.repository";
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository";
import { ContractTypeORMModel } from "../../typeorm/model/contract.typeorm.model";
import { ContractTypeORMRepository } from "../../typeorm/repository/contract.typeorm.repository";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { BenefitEvaluationTypeORMRepository } from "../../typeorm/repository/benefit.typeorm.repository";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationTypeORMRepository } from "../../typeorm/repository/salary-evaluation.typeorm.repository";


export default <Provider[]>[
    {
        provide: EvaluationRepository,
        useClass: EvaluationTypeORMRepository
    },
    {
        provide: OfficeRepository,
        useClass: OfficeTypeORMRepository
    },
    {
        provide: UserRepository,
        useClass: UserTypeORMRepository
    },
    {
        provide: CompanyRepository,
        useClass: CompanyTypeORMRepository
    },
    {
        provide: JobRepository,
        useClass: JobTypeORMRepository
    },
    {
        provide: ContractRepository,
        useClass: ContractTypeORMRepository
    },
    {
        provide: BenefitEvaluationRepository,
        useClass: BenefitEvaluationTypeORMRepository
    },
    {
        provide: SalaryEvaluationRepository,
        useClass: SalaryEvaluationTypeORMRepository
    }

]
