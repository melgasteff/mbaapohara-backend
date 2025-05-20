import { Provider } from "@nestjs/common";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeTypeORMRepository } from "../typeorm/repository/office.typeorm.repository";
import { CompanyRepository } from "src/offices/domain/repository/company.respository";
import { CompanyTypeORMRepository } from "../typeorm/repository/company.typeorm.repository";

export default <Provider[]>[
    {
        provide: OfficeRepository,
        useClass: OfficeTypeORMRepository
    },
    {
        provide: CompanyRepository,
        useClass: CompanyTypeORMRepository
    }
]