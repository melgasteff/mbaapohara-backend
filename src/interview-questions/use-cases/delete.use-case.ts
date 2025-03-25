import { InjectRepository } from "@nestjs/typeorm";
import { InterviewQuestion } from "../entities/interview-question.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteInterviewQuestion {
    constructor(
        @InjectRepository(InterviewQuestion) private interviewQuestionRep: Repository<InterviewQuestion>
    ) { }

    async execute(id: number) {
        const result = await this.interviewQuestionRep.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar la pregunta', HttpStatus.INTERNAL_SERVER_ERROR)

        return result
    }
}