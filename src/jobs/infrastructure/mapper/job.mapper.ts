import { Job } from "src/jobs/domain/model/job.entity";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";
import { NewJob } from "src/jobs/domain/model/new-job.entity";

export class JobMapper {
    static toDomain(jobTypeOrm: JobTypeORMModel): Job {
        return new Job(jobTypeOrm.id, jobTypeOrm.descripcion);
    }

    static toTypeORMModel(newJob: NewJob): JobTypeORMModel {
        const jobTypeorm = new JobTypeORMModel();
        jobTypeorm.descripcion = newJob.getDescripcion();
        return jobTypeorm;
    }
}