import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";

export class GetAllCompanies {
    constructor(
        @InjectRepository(Company) private companyRepository : Repository<Company>
    ){}

    execute() {
        return this.companyRepository.find()
    }
}