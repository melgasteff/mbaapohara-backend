import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/domain/model/company.entity";
import { NewCompany } from "src/companies/domain/model/new-comapny.entity";
import { CompanyRepository } from "src/companies/domain/repository/company.repository";
import { CompanyTypeORMModel } from "../model/company.typeorm.model";
import { Repository } from "typeorm";
import { CompanyMapper } from "../../mapper/company.mapper";

@Injectable()
export class CompanyTypeORMREpository implements CompanyRepository{
    constructor(
        @InjectRepository(CompanyTypeORMModel)
        private readonly companyRepo : Repository<CompanyTypeORMModel>
    ){}

    async create(newCompany: NewCompany): Promise<Company> {
        const companyTypeOrm = await this.companyRepo.save(CompanyMapper.toTypeORMModel(newCompany))
        return CompanyMapper.toDomain(companyTypeOrm)
    }

    async getAll(): Promise<Company[]> {
        return (await this.companyRepo.find()).map(companyTypeOrm => CompanyMapper.toDomain(companyTypeOrm)) 
    }

    async getById(id: number): Promise<Company> {
        const companyTypeOrm = await this.companyRepo.findOneBy({id})
        return companyTypeOrm ? CompanyMapper.toDomain(companyTypeOrm) : null
    }

    async update(id: number, company: Partial<Company>): Promise<Company> {
       const companyFound = await this.companyRepo.findOneBy({id})
       const updatedCompany = Object.assign(companyFound, company)
       const savedCompany = await this.companyRepo.save(updatedCompany)
       return CompanyMapper.toDomain(savedCompany)
    }

    async delete(id: number): Promise<string> {
        await this.companyRepo.delete(id)
        return "Eliminado correctamente"
    }

    count(): Promise<number> {
        return this.companyRepo.count()
    }

}