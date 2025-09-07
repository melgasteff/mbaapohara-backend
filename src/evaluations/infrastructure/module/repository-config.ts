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
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { EvaluationDetailTypeORMRepository } from "../typeorm/repository/evaluation-detail.typeorm.repository";
import { ItemRepository } from "src/evaluations/domain/repository/item.repository";
import { ItemTypeORMRepository } from "../typeorm/repository/item.typeorm.repository";


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
    //Evaluation Detail
    {
        provide: EvaluationDetailRepository,
        useClass: EvaluationDetailTypeORMRepository
    }, 
    {
        provide: ItemRepository, 
        useClass: ItemTypeORMRepository
    }
]
