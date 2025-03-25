import { InjectRepository } from "@nestjs/typeorm";
import { InterviewEvl } from "../entities/interviews-evl.entity";
import { Repository } from "typeorm";

export class GetAllInterviwsEvl {
    constructor(
        @InjectRepository(InterviewEvl) private interviewEvlRep : Repository<InterviewEvl>
    ){}

    execute (){
        return this.interviewEvlRep.find()
    }
}