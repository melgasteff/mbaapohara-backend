import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvl } from "../entities/salaryEvl.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateSalaryEvlDto } from "../dto/update-salaryEvl.dto";

export class UpdateSalatyEvl {
    constructor(
        @InjectRepository(SalaryEvl) private salaryEvlRepository : Repository<SalaryEvl>
    ){}

    async execute(id_evaluacion : number, salaryEvl : UpdateSalaryEvlDto){
        const salaryEvlFound = await this.salaryEvlRepository.findOne({where : {id_evaluacion}})
        if(!salaryEvlFound) throw new HttpException('No se ha encontrado la evaluacion de salario', HttpStatus.NOT_FOUND)
            console.log(salaryEvl)
        try {
            const { id_evaluacion: _, ...updatedFields } = salaryEvl; 
            Object.assign(salaryEvlFound, updatedFields);
            return await this.salaryEvlRepository.save(salaryEvlFound);
            
        } catch (error) {
            throw new HttpException('No se ha podido actualizar', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}