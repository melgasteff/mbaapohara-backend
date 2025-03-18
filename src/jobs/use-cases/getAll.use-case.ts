import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../entities/job.entity";
import { Repository } from "typeorm";

export class GetAllJobs{
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>
    ){}

    execute (){
        return this.jobRepository.find()
    }
}