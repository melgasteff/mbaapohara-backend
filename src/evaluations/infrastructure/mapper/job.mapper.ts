import { Job } from "src/evaluations/domain/model/job.entity";
import { JobTypeORMModel } from "../typeorm/model/job.typeorm.model";


export class JobMapper {
    static toDomain(jobTypeOrm: JobTypeORMModel): Job {
        return new Job(jobTypeOrm.id, jobTypeOrm.descripcion);
    }

    static toTypeORMModel(newJob: Job): JobTypeORMModel {
        const jobTypeorm = new JobTypeORMModel();
        jobTypeorm.id = newJob.getId()
        jobTypeorm.descripcion = newJob.getDescripcion();
        return jobTypeorm;
    }
}