import { Provider } from "@nestjs/common";
import { CountJobsUseCase } from "src/jobs/application/use-case/count.use-case";
import { CreateJobUseCase } from "src/jobs/application/use-case/create.use-case";
import { DeleteJobUseCase } from "src/jobs/application/use-case/delete.use-case";
import { GetAllJobsUseCase } from "src/jobs/application/use-case/get-all.use-case";
import { GetJobByIdUseCase } from "src/jobs/application/use-case/get-by-id.use-case";
import { UpdateJobUseCase } from "src/jobs/application/use-case/update.use-case";
import { JobRepository } from "src/jobs/domain/repository/job.repository";

export default <Provider[]>[
    {
        provide: CountJobsUseCase,
        useFactory: (jobRepo: JobRepository) => new CountJobsUseCase(jobRepo),
        inject: [JobRepository]
    },
    {
        provide: CreateJobUseCase,
        useFactory: (jobRepo: JobRepository) => new CreateJobUseCase(jobRepo),
        inject: [JobRepository]
    },
    {
        provide: GetJobByIdUseCase,
        useFactory: (jobRepo: JobRepository) => new GetJobByIdUseCase(jobRepo),
        inject: [JobRepository]
    },
    {
        provide: DeleteJobUseCase,
        useFactory: (jobRepo: JobRepository) => new DeleteJobUseCase(jobRepo),
        inject: [JobRepository]
    },
    {
        provide: UpdateJobUseCase,
        useFactory: (jobRepo: JobRepository) => new UpdateJobUseCase(jobRepo),
        inject: [JobRepository]
    },
    {
        provide: GetAllJobsUseCase,
        useFactory: (jobRepo: JobRepository) => new GetAllJobsUseCase(jobRepo),
        inject: [JobRepository]
    },
]