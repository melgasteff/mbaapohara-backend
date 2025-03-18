import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../entities/job.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteJob {
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>
    ) { }

    async execute(id: number) {
        const result = await this.jobRepository.delete({ id })
        if (result.affected === 0) throw new HttpException('No se ha podido eliminar el cargo', HttpStatus.INTERNAL_SERVER_ERROR)

        return result
    }
}