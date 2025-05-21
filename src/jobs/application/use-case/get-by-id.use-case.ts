import { Job } from "src/jobs/domain/model/job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobNotFoundException } from "../exception/job-not-found.exception";

export class GetJobByIdUseCase {
    constructor(
        private readonly jobRepo: JobRepository
    ) { }

    async execute(id: number): Promise<Job> {
        try {
            const jobFound = await this.jobRepo.getById(id)
            if (!jobFound) throw new JobNotFoundException(id)
            return jobFound
        } catch (error) {
            console.error("Error al obtener el cargo", error);
            throw error;
        }

    }
}