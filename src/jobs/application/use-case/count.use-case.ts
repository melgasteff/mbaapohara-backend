import { JobRepository } from "src/jobs/domain/repository/job.repository";

export class CountJobsUseCase {
    constructor(
        private jobRepo : JobRepository
    ){}

    execute(){
        return this.jobRepo.count();
    }
}