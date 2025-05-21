import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobNotFoundException } from "../exception/job-not-found.exception";
import { JobInUseException } from "../exception/job-in-use.exception";

export class DeleteJobUseCase {
  constructor(
    private readonly jobRepo: JobRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const job = await this.jobRepo.getById(id);

      if (!job) {throw new JobNotFoundException(id); }

      await this.jobRepo.delete(id);

    } catch (error) {
      console.error("Error al eliminar el cargo:", error);
      if (error instanceof Error && error.message.includes('foreign key'))  throw new JobInUseException(id);
      throw new error
    }
  }
}