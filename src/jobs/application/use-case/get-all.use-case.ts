import { Job } from "src/jobs/domain/model/job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";

export class GetAllJobsUseCase {
    constructor(
        private jobRepo: JobRepository
    ) { }

    async execute(): Promise<Job[]> {
        try {
            return await this.jobRepo.getAll()
        } catch (error) {
            console.error("Error al obtener los cargos:", error);
            throw error;
        }

    }
}