import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository"
import { CompanyTypeORMModel } from "../model/company.typeorm.model"
import { Repository } from "typeorm"
import { CompanyMapper } from "../../mapper/company.mapper"
import { Company } from "src/evaluations/domain/model/ company.entity"


@Injectable()
export class CompanyTypeORMRepository implements CompanyRepository{
    constructor(
        @InjectRepository(CompanyTypeORMModel)
        private readonly companyRepo : Repository<CompanyTypeORMModel>
    ){}
    
    async getByName(companyName: string): Promise<number> {
       const company = await this.companyRepo.findOneBy({ nombre: companyName })
        const companyId = company.id
        return companyId
    }

    async getAll(): Promise<Company[]> {
        return (await this.companyRepo.find()).map(companyTypeOrm => CompanyMapper.toDomain(companyTypeOrm)) 
    }

    async getById(id: number): Promise<Company> {
        const companyTypeOrm = await this.companyRepo.findOneBy({id})
        return companyTypeOrm ? CompanyMapper.toDomain(companyTypeOrm) : null
    }

    count(): Promise<number> {
        return this.companyRepo.count()
    }

}