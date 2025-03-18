import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { CreateJob } from './use-cases/create.use-case';
import { DeleteJob } from './use-cases/delete.use-case';
import { UpdateJob } from './use-cases/update.use-case';
import { GetJobById } from './use-cases/getJobById.use-case';
import { GetJobByName } from './use-cases/getJobByName.use-case';
import { GetAllJobs } from './use-cases/getAll.use-case';

@Module({
  controllers: [JobsController],
  providers: [
    JobsService,
    CreateJob,
    DeleteJob,
    UpdateJob,
    GetJobById,
    GetJobByName,
    GetAllJobs
  ],
  imports : [TypeOrmModule.forFeature([Job])],
  exports: [JobsService]
})
export class JobsModule {}
