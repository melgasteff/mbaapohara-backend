import { InjectRepository } from "@nestjs/typeorm";
import { InterviewEvl } from "../entities/interviews-evl.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteInterviewEvl {
    constructor(
        @InjectRepository(InterviewEvl) private interviewEvlRep: Repository<InterviewEvl>
    ) { }

    async execute(id: number) {
        const result = await this.interviewEvlRep.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar la evaluacion a la entrevista', HttpStatus.INTERNAL_SERVER_ERROR)

        return result
    }
}