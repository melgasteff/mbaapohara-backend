import { Injectable } from "@nestjs/common";
import { Company } from "src/offices/domain/model/ company.entity";
import { CompanyRepository } from "src/offices/domain/repository/company.respository";
import { CompanyMapper } from "../../mapper/company.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyTypeORMModel } from "../model/company.typeorm.model";

@Injectable()
export class CompanyTypeORMRepository implements CompanyRepository{
    constructor(
        @InjectRepository(CompanyTypeORMModel)
        private companyRepo: Repository<CompanyTypeORMModel>
    ){}

    async findById(id: number): Promise<Company> {
        const companyFound = await this.companyRepo.findOneBy({id})
        if (!companyFound) return null;
        return CompanyMapper.toDomain(companyFound );
    }
    async findByName(nombre: string): Promise<Company> {
        return CompanyMapper.toDomain(await this.companyRepo.findOneBy({nombre}) );
    }
}