import { Provider } from "@nestjs/common";
import { CountCompaniesUseCase } from "src/companies/application/use-case/count.use-case";
import { CreateCompanyUseCase } from "src/companies/application/use-case/create.use-case";
import { DeleteCompanyUseCase } from "src/companies/application/use-case/delete.use-case";
import { GetAllCompaniesUseCase } from "src/companies/application/use-case/get-all.use-case";
import { GetCompanyByIdUseCase } from "src/companies/application/use-case/get-by-id.use-case";
import { UpdateCompanyUseCase } from "src/companies/application/use-case/update.use-case";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";

export default <Provider[]>[

    {
        provide: CountCompaniesUseCase,
        useFactory: (companyRepo: CompanyRepository) => new CountCompaniesUseCase(companyRepo),
        inject: [CompanyRepository]
    },
    {
        provide: CreateCompanyUseCase,
        useFactory: (companyRepo: CompanyRepository) => new CreateCompanyUseCase(companyRepo),
        inject: [CompanyRepository]
    },
    {
        provide: UpdateCompanyUseCase,
        useFactory: (companyRepo: CompanyRepository) => new UpdateCompanyUseCase(companyRepo),
        inject: [CompanyRepository]
    },
    {
        provide: DeleteCompanyUseCase,
        useFactory: (companyRepo: CompanyRepository) => new DeleteCompanyUseCase(companyRepo),
        inject: [CompanyRepository]
    },
    {
        provide: GetAllCompaniesUseCase,
        useFactory: (companyRepo: CompanyRepository) => new GetAllCompaniesUseCase(companyRepo),
        inject: [CompanyRepository]
    },
    {
        provide: GetCompanyByIdUseCase,
        useFactory: (companyRepo: CompanyRepository) => new GetCompanyByIdUseCase(companyRepo),
        inject: [CompanyRepository]
    },
]