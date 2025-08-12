import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountJobsUseCase } from "src/jobs/application/use-case/count.use-case";
import { CreateJobUseCase } from "src/jobs/application/use-case/create.use-case";
import { DeleteJobUseCase } from "src/jobs/application/use-case/delete.use-case";
import { GetAllJobsUseCase } from "src/jobs/application/use-case/get-all.use-case";
import { GetJobByIdUseCase } from "src/jobs/application/use-case/get-by-id.use-case";
import { UpdateJobUseCase } from "src/jobs/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/jobs/infrastructure/exception-filter/exception-filter";
import { NewJobDTO } from "../dto/new-job.dto";
import { JobDTO } from "../dto/job.dto";
import { JobDTOMapper } from "../mapper/job-dto.mapper";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";

@UseFilters(GlobalExceptionFilter)
@Controller('jobs')
export class JobController {
    constructor(
        private readonly createJobUC: CreateJobUseCase,
        private readonly updateJobUC: UpdateJobUseCase,
        private readonly deleteJobUC: DeleteJobUseCase,
        private readonly getJobByIdUC: GetJobByIdUseCase,
        private readonly getAllJobsUC: GetAllJobsUseCase,
        private readonly countJobsUC: CountJobsUseCase
    ) { }
    @Post()
    async createJob(@Body() jobDTO: NewJobDTO): Promise<JobDTO> {
        return JobDTOMapper.toDTO(await this.createJobUC.execute(jobDTO.descripcion));
    }

    @Get()
    async getAllJobs(): Promise<ResponseModel<JobDTO>> {
        const jobDto = (await this.getAllJobsUC.execute()).map(job => JobDTOMapper.toDTO(job));        
        return {
            count: await this.countJobsUC.execute(),
            data: jobDto
        }
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