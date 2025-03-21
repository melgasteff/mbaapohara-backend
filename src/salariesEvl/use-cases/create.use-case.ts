import { InjectRepository } from "@nestjs/typeorm";
import { SalaryEvl } from "../entities/salaryEvl.entity";
import { Repository } from "typeorm";
import { CreateSalaryEvlDto } from "../dto/create-salaryEvl.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Evaluation } from "src/evaluations/entities/evaluation.entity";

export class CreateSalaryEvl {
    constructor(
        @InjectRepository(SalaryEvl) private salaryEvlRepository: Repository<SalaryEvl>,
        @InjectRepository(Evaluation) private evaluationRepository: Repository<Evaluation>
    ) { }

    async execute(salaryEvl: CreateSalaryEvlDto) {
        const evaluationFound = await this.evaluationRepository.findOne({ where: { id: salaryEvl.id_evaluacion } })
        if (!evaluationFound) throw new HttpException('La evaluacion no existe', HttpStatus.NOT_ACCEPTABLE)
        
        const salaryEvlFound = await this.salaryEvlRepository.findOne({ where: { id_evaluacion: salaryEvl.id_evaluacion } })

        if (salaryEvlFound) throw new HttpException('La evaluacion al salario ya existe', HttpStatus.CONFLICT)
        console.log(salaryEvl)
        try {
            const newSalaryEvl = this.salaryEvlRepository.create(salaryEvl)
            return await this.salaryEvlRepository.save(newSalaryEvl)
        } catch (error) {
            throw new HttpException('No se ha podido crear una evaluacion de salario', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}