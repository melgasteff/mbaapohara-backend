import { CompanyRepository } from "src/companies/domain/repository/company.repository";

export class CountCompaniesUseCase {
    constructor(
        private companyRepo : CompanyRepository
    ){}

    execute(){
        return this.companyRepo.count();
    }
}