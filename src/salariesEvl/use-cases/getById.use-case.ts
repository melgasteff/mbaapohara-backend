import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvl } from "../entities/salaryEvl.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetSalaryEvlById {
    constructor(
        @InjectRepository(SalaryEvl) private salaryEvlRepository : Repository<SalaryEvl>
    ){}

    async execute(id_evaluacion :number){
        const salaryEvlFound = await this.salaryEvlRepository.findOne({where : {id_evaluacion}})
        if(!salaryEvlFound) throw new HttpException('No se ha encontrado la evaluacion de salario', HttpStatus.NOT_FOUND)
        return salaryEvlFound
    }
}