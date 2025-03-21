import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvl } from "../entities/salaryEvl.entity";
import { Repository } from "typeorm";

export class GetAllSalariesEvl{
    constructor(
        @InjectRepository(SalaryEvl) private salaryEvlRepository : Repository<SalaryEvl>
    ){}

    execute(){
        return this.salaryEvlRepository.find()
    }
}