import { Job } from "src/jobs/domain/model/job.entity"
import { JobDTO } from "../dto/job.dto"

export class JobDTOMapper{
    static toDTO(job: Job): JobDTO{
        return { 
            id: job.getId(),
            descripcion: job.getDescripcion(),
        }
    }

    static toDomain(jobDTO: JobDTO): Job{
        return new Job(jobDTO.id, jobDTO.descripcion)
    }
}