import { NewCompany } from "src/companies/domain/model/new-comapny.entity";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyAlreadyExistsException } from "../exception/company-already-exists.exception";
import { Company } from "src/companies/domain/model/company.entity";

export class CreateCompanyUseCase {
    constructor(
        private companyRepo: CompanyRepository
    ) { }

    async execute( nombre: string, rubro: string): Promise<Company> {
        try {
            const allCompanies = await this.companyRepo.getAll();
            const companyFound = allCompanies.find((company) => company.getNombre().toLocaleLowerCase() === nombre.toLocaleLowerCase());
            if (companyFound) throw new CompanyAlreadyExistsException(nombre)
            const newCompany = new NewCompany( nombre, rubro)
            return await this.companyRepo.create(newCompany)
        } catch (error) {
            console.log("Error al crear la empresa: ", error)
            throw error
        }
    }
}