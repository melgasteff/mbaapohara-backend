import { InjectRepository } from "@nestjs/typeorm";
import { InterviewQuestion } from "../entities/interview-question.entity";
import { Repository } from "typeorm";

export class GetAllInterviewQuestions {
    constructor(
        @InjectRepository(InterviewQuestion) private interviiewQuestionRep : Repository<InterviewQuestion>
    ){}

    async execute(){
        return await this.interviiewQuestionRep.find()
    }
}