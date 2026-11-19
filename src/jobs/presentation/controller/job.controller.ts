import { ApiTags } from "@nestjs/swagger";
import { Body, Query, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { mapPage, Page } from "src/shared/domain/page";
import { PaginationQueryDTO } from "src/shared/infrastructure/rest/pagination-query.dto";
import { CreateJobUseCase } from "src/jobs/application/use-case/create.use-case";
import { DeleteJobUseCase } from "src/jobs/application/use-case/delete.use-case";
import { GetAllJobsUseCase } from "src/jobs/application/use-case/get-all.use-case";
import { GetJobByIdUseCase } from "src/jobs/application/use-case/get-by-id.use-case";
import { UpdateJobUseCase } from "src/jobs/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/jobs/infrastructure/exception-filter/exception-filter";
import { NewJobDTO } from "../dto/new-job.dto";
import { JobDTO } from "../dto/job.dto";
import { JobDTOMapper } from "../mapper/job-dto.mapper";

@UseFilters(GlobalExceptionFilter)
@ApiTags('Cargos')
@Controller('jobs')
export class JobController {
    constructor(
        private readonly createJobUC: CreateJobUseCase,
        private readonly updateJobUC: UpdateJobUseCase,
        private readonly deleteJobUC: DeleteJobUseCase,
        private readonly getJobByIdUC: GetJobByIdUseCase,
        private readonly getAllJobsUC: GetAllJobsUseCase
    ) { }
    @Post()
    async createJob(@Body() jobDTO: NewJobDTO): Promise<JobDTO> {
        return JobDTOMapper.toDTO(await this.createJobUC.execute(jobDTO.descripcion));
    }

    @Get()
    async getAllJobs(@Query() query: PaginationQueryDTO): Promise<Page<JobDTO>> {
        return mapPage(await this.getAllJobsUC.execute(query), job => JobDTOMapper.toDTO(job));
    }

    @Get(':id')
    async getJobById(@Param('id', ParseIntPipe) id: number): Promise<JobDTO> {
        return JobDTOMapper.toDTO(await this.getJobByIdUC.execute(id));
    }

    @Put(':id')
    async updateJob(@Param('id', ParseIntPipe) id: number, @Body() job: JobDTO): Promise<JobDTO> {
        const jobToUpdate = JobDTOMapper.toDomain(job);
        const updatedJob = await this.updateJobUC.execute(id, jobToUpdate.getDescripcion());
        return JobDTOMapper.toDTO(updatedJob);
    }

    @Delete(':id')
    deleteCity(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteJobUC.execute(id);
    }
}