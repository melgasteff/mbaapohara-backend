import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";
import { CreateCompanyDto } from "../dto/create-company.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CreateCompany {
    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>
    ) { }

    async execute(company: CreateCompanyDto) {
        const companyFound = await this.companyRepository.findOne({ where: { nombre: company.nombre} });
        if (companyFound) throw new HttpException('La empresa ya existe', HttpStatus.CONFLICT);
    
        try{
        const newCompany = this.companyRepository.create(company);
        return await this.companyRepository.save(newCompany);
        }catch(error){
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
}