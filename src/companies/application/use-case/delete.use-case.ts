import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyNotFoundException } from "../exception/company-not-found.exception";
import { CompanyInUseException } from "../exception/company-in-use.exception";

export class DeleteCompanyUseCase {
  constructor(
    private readonly comapanyRepo: CompanyRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const company = await this.comapanyRepo.getById(id);

      if (!company) {throw new CompanyNotFoundException(id); }

      await this.comapanyRepo.delete(id);

    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
      if (error instanceof Error && error.message.includes('foreign key'))  throw new CompanyInUseException(id);
      throw new error
    }
  }
}