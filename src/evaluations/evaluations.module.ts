import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './entities/evaluation.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllEvaluations } from './use-cases/getAll.use-case';
import { UpdateEvaluation } from './use-cases/update.use-case';
import { CreateEvaluation } from './use-cases/create.use-case';
import { Company } from 'src/companies/entities/company.entity';
import { Office } from 'src/offices/entities/office.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { DeleteEvaluation } from './use-cases/delete.use-case';
import { GetEvaluationById } from './use-cases/GetById.use-case';

@Module({
  controllers: [EvaluationsController],
  imports: [TypeOrmModule.forFeature([User, Evaluation, Office, Company, Job])],
  providers: [
    EvaluationsService, 
    GetAllEvaluations,
    UpdateEvaluation,
    CreateEvaluation, 
    DeleteEvaluation, 
    GetEvaluationById
  ],
  exports : [EvaluationsService]
})
export class EvaluationsModule {}
