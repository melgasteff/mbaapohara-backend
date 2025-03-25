import { InjectRepository } from "@nestjs/typeorm";
import { InterviewQuestion } from "../entities/interview-question.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetInterviewQuestionById {
    constructor(
        @InjectRepository(InterviewQuestion) private interviewQuestionRep: Repository<InterviewQuestion>
    ) { }

    async execute(id: number) {
        const interviewQuestionFound = await this.interviewQuestionRep.findOne({ where: { id } })
        if (!interviewQuestionFound) throw new HttpException('No se ha encontrado la pregunta', HttpStatus.NOT_FOUND)

        return interviewQuestionFound
    }
}