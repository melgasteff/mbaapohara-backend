import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../entities/job.entity";
import { Repository } from "typeorm";
import { CreateJobDto } from "../dto/create-job.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CreateJob{
    constructor(
        @InjectRepository(Job) private jobRepository : Repository<Job>
    ){}

    async execute(newJob : CreateJobDto){
        const jobFound = await this.jobRepository.findOne({where : {descripcion : newJob.descripcion}})
        if(jobFound) throw new HttpException(`El cargo ${newJob.descripcion} ya existe`, HttpStatus.CONFLICT)
        try {
            const createdJob = this.jobRepository.create(newJob)
            return this.jobRepository.save(createdJob)
        } catch (error) {
            throw new HttpException('No se ha podido crear un nuevo puesto de trabajo', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}