import { Job } from "src/jobs/domain/model/job.entity";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { Page, PageRequest } from "src/shared/domain/page";

export class GetAllJobsUseCase {
    constructor(
        private jobRepo: JobRepository
    ) { }

    async execute(request: PageRequest): Promise<Page<Job>> {
        return this.jobRepo.getPage(request);
    }
}
