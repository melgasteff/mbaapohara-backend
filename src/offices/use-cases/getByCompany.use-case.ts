import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";
import { Company } from "src/companies/entities/company.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetOfficesByCompany {
    constructor(
        @InjectRepository(Office) private officeRepository :Repository<Office>,
        @InjectRepository(Company) private companyRepository : Repository<Company>
    ){}

    async execute(id_empresa : number){
        const companyFound =  await this.companyRepository.findOne({where : {id : id_empresa}})
        const officesFound = await this.officeRepository.find({where : {empresa : companyFound}, relations:['empresa']})
        if(officesFound.length === 0 )  throw new HttpException('La empresa no tiene sucursales', HttpStatus.NOT_FOUND)
        return officesFound
    }
}