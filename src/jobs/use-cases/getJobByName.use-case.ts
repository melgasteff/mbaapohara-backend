import { HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Job } from "../entities/job.entity"

export class GetJobByName {
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>
    ) { }

    async execute(job: string) {
        console.log("execute")
        const jobFound = await this.jobRepository.findOne({ where: { descripcion: job } })
        if (!jobFound) throw new HttpException('No se ha podido encontrar el cargo', HttpStatus.NOT_FOUND)
        console.log(jobFound)
        return jobFound
    }
}