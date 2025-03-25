import { InjectRepository } from "@nestjs/typeorm";
import { InterviewQuestion } from "../entities/interview-question.entity";
import { Repository } from "typeorm";
import { UpdateInterviewQuestionDto } from "../dto/update-interview-question.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UpdateInterviewQuestion {
    constructor(
        @InjectRepository(InterviewQuestion) private interviewQuestionRep: Repository<InterviewQuestion>
    ) { }

    async execute(id: number, interviewQuestion: UpdateInterviewQuestionDto) {
        const interviewQuestionFound = await this.interviewQuestionRep.findOne({ where: { id }, relations: ['interviewEvl'] })
        if (!interviewQuestionFound) throw new HttpException('No se ha encontrado la pregunta', HttpStatus.NOT_FOUND)

        try {
            const updatedInterviewQuestion = Object.assign(interviewQuestionFound, interviewQuestion)
            return this.interviewQuestionRep.save(updatedInterviewQuestion)
        } catch (error) {
            console.log(error.message)
            throw new HttpException('No se ha podido actualizar la pregunta', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}