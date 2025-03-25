import { InjectRepository } from "@nestjs/typeorm";
import { InterviewEvl } from "../entities/interviews-evl.entity";
import { Repository } from "typeorm";
import { CreateInterviewsEvlDto } from "../dto/create-interviews-evl.dto";
import e from "express";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Evaluation } from "src/evaluations/entities/evaluation.entity";

export class CreateInterviewEvl {
    constructor(
        @InjectRepository(InterviewEvl) private interviewEvlRep: Repository<InterviewEvl>,
        @InjectRepository(Evaluation) private evaluationRep: Repository<Evaluation>
    ) { }

    async execute(interviewEvl: CreateInterviewsEvlDto) {
        const evaluationFound = await this.evaluationRep.findOne({ where: { id: interviewEvl.id_evaluacion } })
        if (!evaluationFound) throw new HttpException('No se ha encontrado la evaluacion', HttpStatus.NOT_FOUND)

        const interviewEvlFound = await this.interviewEvlRep.findOne({ where: { id_evaluacion: interviewEvl.id_evaluacion } })
        if (interviewEvlFound) throw new HttpException('La evaluacion a la entrevista ya existe', HttpStatus.CONFLICT)
        try {
            const newInterviewEvl = this.interviewEvlRep.create(interviewEvl)
            return this.interviewEvlRep.save(newInterviewEvl)
        } catch (error) {
            console.log(error.message)
            throw new HttpException('No se ha podido guardar la evaluacion a la entrevista', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}