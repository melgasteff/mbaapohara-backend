import { Job } from '../job.entity';

export class JobDTO {
    id: number;
    descripcion: string;

    static from(job: Job): JobDTO {
        return { id: job.id, descripcion: job.descripcion };
    }
}

export class JobPageDTO {
    data: JobDTO[];
    total: number;
    page: number;
    pageSize: number;
}
