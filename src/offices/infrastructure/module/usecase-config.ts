import { Provider } from "@nestjs/common";
import { CountOfficesUseCase } from "src/offices/application/use-case/count.use-case";
import { CreateOfficeUseCase } from "src/offices/application/use-case/create.use-case";
import { DeleteOfficeUseCase } from "src/offices/application/use-case/delete.use-case";
import { GetAllOfficesUseCase } from "src/offices/application/use-case/get-all.use-case";
import { GetOfficeByIdUseCase } from "src/offices/application/use-case/get-by-id.use-case";
import { UpdateOfficeUseCase } from "src/offices/application/use-case/update.use-case";
import { CompanyRepository } from "src/offices/domain/repository/company.respository";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";

export default <Provider[]>[
    {
        provide: CountOfficesUseCase,
        useFactory: (officeRepo: OfficeRepository) => new CountOfficesUseCase(officeRepo),
        inject: [OfficeRepository]
    },
    {
        provide: CreateOfficeUseCase,
        useFactory: (officeRepo: OfficeRepository, companyRepo: CompanyRepository) => new CreateOfficeUseCase(officeRepo, companyRepo),
        inject: [OfficeRepository, CompanyRepository]
    },
    {
        provide: GetOfficeByIdUseCase,
        useFactory: (officeRepo: OfficeRepository) => new GetOfficeByIdUseCase(officeRepo),
        inject: [OfficeRepository]
    },
    {
        provide: DeleteOfficeUseCase,
        useFactory: (officeRepo: OfficeRepository) => new DeleteOfficeUseCase(officeRepo),
        inject: [OfficeRepository]
    },
    {
        provide: UpdateOfficeUseCase,
        useFactory: (officeRepo: OfficeRepository, companyRepo: CompanyRepository) => new UpdateOfficeUseCase(officeRepo, companyRepo),
        inject: [OfficeRepository, CompanyRepository]
    },
    {
        provide: GetAllOfficesUseCase,
        useFactory: (officeRepo: OfficeRepository) => new GetAllOfficesUseCase(officeRepo),
        inject: [OfficeRepository]
    }
]