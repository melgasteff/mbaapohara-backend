import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "../entities/job.entity";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetJobById {
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>
    ) { }

    async execute(id: number) {
        const jobFound = await this.jobRepository.findOne({ where: { id } })
        if (!jobFound) throw new HttpException('No se ha podido encontrar el cargo', HttpStatus.NOT_FOUND)

        return jobFound
    }
}