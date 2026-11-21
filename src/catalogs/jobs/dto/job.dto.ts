import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
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

/** Cargo con su estado, para la administración. */
export class AdminJobDTO extends JobDTO {
    estado: ProposalStatus;

    static fromAdmin(job: Job): AdminJobDTO {
        return { ...JobDTO.from(job), estado: job.estado };
    }
}

export class AdminJobPageDTO {
    data: AdminJobDTO[];
    total: number;
    page: number;
    pageSize: number;
}

/** Filtros de GET /jobs/admin. */
export class AdminJobsQueryDTO extends PaginationQueryDTO {
    /** Estado del cargo. Sin este filtro, todos. */
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsEnum(ProposalStatus)
    estado?: ProposalStatus;
}
