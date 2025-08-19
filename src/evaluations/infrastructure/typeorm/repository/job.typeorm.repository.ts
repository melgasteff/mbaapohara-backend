import { Injectable } from "@nestjs/common";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { JobTypeORMModel } from "../model/job.typeorm.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "src/evaluations/domain/model/job.entity";
import { Repository } from "typeorm";
import { JobMapper } from "../../mapper/job.mapper";


@Injectable()
export class JobTypeORMRepository implements JobRepository {
    constructor(
        @InjectRepository(JobTypeORMModel)
        private readonly jobRepo: Repository<JobTypeORMModel>
    ) { }

    async getByName(jobName: string): Promise<number> {
        const job = await this.jobRepo.findOneBy({ descripcion: jobName })
        const jobId = job.id
        return jobId
    }


    async getAll(): Promise<Job[]> {
        return (await this.jobRepo.find()).map(jobOrm => JobMapper.toDomain(jobOrm));
    }

    async getById(id: number): Promise<Job | null> {
        const jobOrm = await this.jobRepo.findOne({ where: { id } });
        return jobOrm ? JobMapper.toDomain(jobOrm) : null;
    }

    count(): Promise<number> {
        return this.jobRepo.count();
    }

}