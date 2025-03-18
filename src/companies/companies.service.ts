import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompany } from './use-cases/create.use-case';
import { UpdateCompany } from './use-cases/update.use-case';
import { GetCompanyById } from './use-cases/getById.use-case';
import { DeleteCompany } from './use-cases/delete.use-case';
import { GetAllCompanies } from './use-cases/getAll.use-case';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly createCompanyUC : CreateCompany,
    private readonly updateCompanyUC : UpdateCompany,
    private readonly getCompanyByIdUC : GetCompanyById,
    private readonly deleteComanyUC : DeleteCompany,
    private readonly getAllCompaniesUC : GetAllCompanies
  ){}
  createCompany(Company: CreateCompanyDto) {
    return this.createCompanyUC.execute(Company)
  }

  getCompanyById(id: number) {
    return this.getCompanyByIdUC.execute(id)
  }

  getAllCompanies() {
    return this.getAllCompaniesUC.execute()
  }

  updateCompany(id: number, company: UpdateCompanyDto) {
    return this.updateCompanyUC.execute(id, company)
  }

  deleteCompany(id: number) {
    return this.deleteComanyUC.execute(id)
  }
}
