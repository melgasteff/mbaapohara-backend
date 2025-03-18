import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJob } from './use-cases/create.use-case';
import { UpdateJob } from './use-cases/update.use-case';
import { GetAllJobs } from './use-cases/getAll.use-case';
import { DeleteJob } from './use-cases/delete.use-case';
import { GetJobById } from './use-cases/getJobById.use-case';
import { GetJobByName } from './use-cases/getJobByName.use-case';

@Injectable()
export class JobsService {
  constructor(
    private readonly createJobUC : CreateJob,
    private readonly updateJobUC : UpdateJob,
    private readonly getAllJobsUC : GetAllJobs,
    private readonly deleteJobsUC : DeleteJob,
    private readonly getJobByIdUC : GetJobById,
    private readonly getJobByNameUC : GetJobByName
  ){}
  createJob(newJob: CreateJobDto) {
    return this.createJobUC.execute(newJob)
  }

  getAllJobs() {
    return this.getAllJobsUC.execute()
  }

  getJobById(id: number) {
    return this.getJobByIdUC.execute(id)
  }

  getJobByName(job :string){
    console.log(job)
    return this.getJobByNameUC.execute(job)
  }

  updateJob(id: number, job: UpdateJobDto) {
    return this.updateJobUC.execute(id, job)
  }

  deleteJob(id: number) {
    return this.deleteJobsUC.execute(id);
  }
}
