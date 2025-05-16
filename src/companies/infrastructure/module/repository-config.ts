import { Provider } from "@nestjs/common";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyTypeORMREpository } from "../typeorm/repository/company.typeorm.repository";

export default <Provider[]>[
    {
        provide: CompanyRepository,
        useClass: CompanyTypeORMREpository
    },
]