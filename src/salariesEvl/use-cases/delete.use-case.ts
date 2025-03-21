import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvl } from "../entities/salaryEvl.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteSalaryEvl {
    constructor(
        @InjectRepository(SalaryEvl) private salaryEvlRepository: Repository<SalaryEvl>
    ) { }

    async execute(id: number) {
        const result = await this.salaryEvlRepository.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar la evaluacion de salario', HttpStatus.INTERNAL_SERVER_ERROR)
        return result
    }
}