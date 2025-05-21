import { Job } from "src/jobs/domain/model/job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobNotFoundException } from "../exception/job-not-found.exception";

export class UpdateJobUseCase {
    constructor(
        private readonly jobRepo : JobRepository
    ){}

    async execute(id: number, descripcion: string) : Promise<Job>{
        try {
              const allJobs = await this.jobRepo.getAll();
              const officeFound = allJobs.find((job) => job.getId() === id);
        
              if (!officeFound) { throw new JobNotFoundException(id); }
              const jobToUpdate = new Job(id, descripcion)
              return this.jobRepo.update(id, jobToUpdate)

            } catch (error) {
              console.error("Error al actualizar el cargo:", error);
              throw new error
            }
    }
}