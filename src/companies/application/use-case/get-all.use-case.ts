import { Company } from "src/companies/domain/model/company.entity";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";

export class GetAllCompaniesUseCase {
    constructor(
        private companyRepo: CompanyRepository
    ){}

    public async execute(): Promise<Company[]>{
        return this.companyRepo.getAll();
    }
}