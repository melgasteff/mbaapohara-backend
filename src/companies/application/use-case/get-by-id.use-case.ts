import { Company } from "src/companies/domain/model/company.entity";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyNotFoundException } from "../exception/company-not-found.exception";

export class GetCompanyByIdUseCase {
    constructor(
        private readonly companyRepo: CompanyRepository
    ) { }

    async execute(id: number): Promise<Company> {
        const companyfound = await this.companyRepo.getById(id)
        if (!companyfound) throw new CompanyNotFoundException(id)
        return companyfound
    

    }
}