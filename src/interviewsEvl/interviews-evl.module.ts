import { Module } from '@nestjs/common';
import { InterviewsEvlService } from './interviews-evl.service';
import { InterviewsEvlController } from './interviews-evl.controller';
import { GetAllInterviwsEvl } from './use-cases/getAll.use-case';
import { GetInterviewEvlById } from './use-cases/getById.use-case';
import { DeleteInterviewEvl } from './use-cases/delete.use-case';
import { UpdateInterviewEvl } from './use-cases/update.use-case';
import { CreateInterviewEvl } from './use-cases/create.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewEvl } from './entities/interviews-evl.entity';
import { Evaluation } from 'src/evaluations/entities/evaluation.entity';

@Module({
  controllers: [InterviewsEvlController],
  providers: [
    InterviewsEvlService,
    GetAllInterviwsEvl,
    GetInterviewEvlById,
    DeleteInterviewEvl,
    UpdateInterviewEvl,
    CreateInterviewEvl
  ],
  imports: [TypeOrmModule.forFeature([InterviewEvl, Evaluation])],
  exports: [InterviewsEvlService]
})
export class InterviewsEvlModule {}
