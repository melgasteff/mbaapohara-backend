import { Provider } from "@nestjs/common";
import { SalaryEvaluationRepository } from "src/evaluations/domain/repository/salary-evaluation.repository";
import { SalaryEvaluationTypeORMRepository } from "../typeorm/repository/salary-evaluation.typeorm.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { CompanyTypeORMRepository } from "../typeorm/repository/company.typeorm.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { OfficeTypeORMRepository } from "../typeorm/repository/office.typeorm.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { UserTypeORMRepository } from "../typeorm/repository/user.typeorm.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { JobTypeORMRepository } from "../typeorm/repository/job.typeorm.repository";

export default <Provider[]>[
    {
        provide: SalaryEvaluationRepository,
        useClass: SalaryEvaluationTypeORMRepository
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
    
    
    
]