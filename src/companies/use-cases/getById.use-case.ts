import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetCompanyById {
    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>
    ){}

    async execute (id){
        const companyFound = await this.companyRepository.findOne({where : {id}})
        if(!companyFound) throw new HttpException('No se ha encontrado la empresa', HttpStatus.NOT_FOUND)
        
        return companyFound
    }
}