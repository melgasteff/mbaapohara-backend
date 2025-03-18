import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../entities/job.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateJobDto } from "../dto/update-job.dto";

export class UpdateJob {
    constructor(
        @InjectRepository(Job) private jobRepository : Repository<Job>
    ){}

    async execute(id: number, job :UpdateJobDto){
        const jobFound = await  this.jobRepository.findOne({where: {id}})
        if(!jobFound) throw new HttpException('No se ha encontrado el cargo', HttpStatus.NOT_FOUND)
        
        try {
            const updatedJob = Object.assign(jobFound, job)
            return this.jobRepository.save(updatedJob)
        } catch (error) {
            throw new HttpException('No se ha podido actualizar el cargo', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}