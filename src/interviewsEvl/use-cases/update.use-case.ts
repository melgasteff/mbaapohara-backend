import { InjectRepository } from "@nestjs/typeorm";
import { InterviewEvl } from "../entities/interviews-evl.entity";
import { Repository } from "typeorm";
import { UpdateInterviewsEvlDto } from "../dto/update-interviews-evl.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UpdateInterviewEvl {
    constructor(
        @InjectRepository(InterviewEvl) private interviewEvlRep : Repository<InterviewEvl>
    ){}

    async execute(id_evaluacion: number, interviewEvl : UpdateInterviewsEvlDto){
        const interviewEvlFound= await this.interviewEvlRep.findOne({where : {id_evaluacion}, relations: ['evaluation']})
        if(!interviewEvlFound) throw new HttpException('No se ha encontrado la evaluacion a la entrevista', HttpStatus.NOT_FOUND)
        console.log(interviewEvl, interviewEvlFound)

        try {
            const updatedInterviewEvl = Object.assign(interviewEvlFound, interviewEvl)
            return await this.interviewEvlRep.save(updatedInterviewEvl)
        } catch (error) {
            console.log(error.message)
            throw new HttpException('No se ha podido actualizar la evaluacion a la entrevista', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}