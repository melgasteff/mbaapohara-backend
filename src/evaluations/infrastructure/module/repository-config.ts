import { Provider } from "@nestjs/common";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { EvaluationTypeORMRepository } from "../typeorm/repository/evaluation.typeorm.repository";
import { OfficeTypeORMRepository } from "../typeorm/repository/office.typeorm.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { UserTypeORMRepository } from "../typeorm/repository/user.typeorm.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { CompanyTypeORMRepository } from "../typeorm/repository/company.typeorm.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { JobTypeORMRepository } from "../typeorm/repository/job.typeorm.repository";


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

]
