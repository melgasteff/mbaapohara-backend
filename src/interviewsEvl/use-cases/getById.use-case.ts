import { InjectRepository } from "@nestjs/typeorm";
import { InterviewEvl } from "../entities/interviews-evl.entity";
import { Repository } from "typeorm";
import { Http2ServerRequest } from "http2";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetInterviewEvlById {
    constructor(
        @InjectRepository(InterviewEvl) private interviewEvlRep: Repository<InterviewEvl>
    ) { }

    async execute(id: number) {
        const interviewEvlFound = await this.interviewEvlRep.findOne({ where: { id_evaluacion: id } })
        if (!interviewEvlFound) throw new HttpException('No se ha encontrado la enevaluacion a la entrevista', HttpStatus.INTERNAL_SERVER_ERROR)

        return interviewEvlFound
    }
}