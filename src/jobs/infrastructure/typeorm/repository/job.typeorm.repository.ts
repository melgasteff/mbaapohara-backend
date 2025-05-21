import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "src/jobs/domain/model/job.entity";
import { NewJob } from "src/jobs/domain/model/new-job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobTypeORMModel } from "../model/job.typeorm.model";
import { JobMapper } from "../../mapper/job.mapper";
import { Repository } from "typeorm";

@Injectable()
export class JobTypeORMRepository implements JobRepository {
    constructor(
        @InjectRepository(JobTypeORMModel)
        private readonly jobRepo: Repository<JobTypeORMModel>
    ) { }

    async create(newJob: NewJob): Promise<Job> {
        const jobTypeOrm = await this.jobRepo.save(JobMapper.toTypeORMModel(newJob))
        return JobMapper.toDomain(jobTypeOrm);
    }

    async getAll(): Promise<Job[]> {
        return (await this.jobRepo.find()).map(jobOrm => JobMapper.toDomain(jobOrm));
    }

    async getById(id: number): Promise<Job | null> {
        const jobOrm = await this.jobRepo.findOne({ where: { id } });
        return jobOrm ? JobMapper.toDomain(jobOrm) : null;
    }

    async update(id: number, job: Partial<Job>): Promise<Job> {
        const jobFound = await this.jobRepo.findOne({ where: { id } });
        const updatedJob = Object.assign(jobFound, job);
        const savedJob = await this.jobRepo.save(updatedJob);
        return JobMapper.toDomain(savedJob);
    }

    async delete(id: number): Promise<void> {
        await this.jobRepo.delete(id);
    }

    count(): Promise<number> {
        return this.jobRepo.count();
    }

}