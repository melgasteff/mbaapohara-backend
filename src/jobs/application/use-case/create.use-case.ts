import { NewJob } from "src/jobs/domain/model/new-job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobAlreadyExistsException } from "../exception/job-already-exists.exception";

export class CreateJobUseCase {
    constructor(
        private readonly jobRepo: JobRepository
    ) { }

    async execute( descripcion: string) {
        try {
            const allJobs = await this.jobRepo.getAll()
    
            const jobFound = allJobs.find((job) => job.getDescripcion().toLocaleLowerCase() == descripcion.toLocaleLowerCase());
            if (jobFound) throw new JobAlreadyExistsException(descripcion)

            const newJob = await new NewJob(descripcion)
            return await this.jobRepo.create(newJob)
        } catch (error) {
            console.error("Error al crear el cargo:", error);
            throw error;
        }
    }
}