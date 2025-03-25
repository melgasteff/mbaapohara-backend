import { InjectRepository } from "@nestjs/typeorm";
import { InterviewQuestion } from "../entities/interview-question.entity";
import { Repository } from "typeorm";
import { CreateInterviewQuestionDto } from "../dto/create-interview-question.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { InterviewEvl } from "src/interviewsEvl/entities/interviews-evl.entity";

export class CreateInterviewQuestion {
    constructor(
        @InjectRepository(InterviewQuestion) private interviewQuestionRep: Repository<InterviewQuestion>,
        @InjectRepository(InterviewEvl) private interviewEvlRep: Repository<InterviewEvl>
    ) { }

    async execute(interviewQuestion: CreateInterviewQuestionDto) {
        const interviewEvlFound = await this.interviewEvlRep.findOne({ where: { id_evaluacion: interviewQuestion.id_entrevista }, relations: ['evaluation']})
        console.log(interviewQuestion.id_entrevista, interviewEvlFound)
        if (!interviewEvlFound) throw new HttpException('No se ha encontrado la evaluacion a la entrevista', HttpStatus.NOT_FOUND)

        try {
            const newInterviewQuestion = this.interviewQuestionRep.create(interviewQuestion)
            return this.interviewQuestionRep.save(newInterviewQuestion)
        } catch (error) {
            console.log('El error es: ',error.message)
            throw new HttpException('No se ha podido crear una nueva pregunta de entrevista', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}