import { Company } from "src/companies/domain/model/company.entity";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyNotFoundException } from "../exception/company-not-found.exception";

export class UpdateCompanyUseCase {
  constructor(

    private readonly companyRepo: CompanyRepository) { }

  async execute(id: number, company: Company): Promise<Company> {
    try {
      const allCompanies = await this.companyRepo.getAll();

      const companyFound = allCompanies.find((company) => company.getId() === id);

      if (!companyFound) { throw new CompanyNotFoundException(id); }

      return this.companyRepo.update(id, company)
    } catch (error) {
      console.error("Error al obtener la empresa:", error);
      throw new error
    }

  }
}