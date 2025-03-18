import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UpdateCompany{
    constructor(
        @InjectRepository(Company) private companyRepository : Repository<Company>
    ){}

    async execute(id: number, company){
        const companyFound = await this.companyRepository.findOne({where : {id}})
        if(!companyFound) throw new HttpException("No se ha encontrado la empresa", HttpStatus.NOT_FOUND)

        try {
            const updatedCompany = Object.assign(companyFound, company)
            return this.companyRepository.save(updatedCompany)
        } catch (error) {
            throw new HttpException('No se ha podido actulizar la compañia', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}