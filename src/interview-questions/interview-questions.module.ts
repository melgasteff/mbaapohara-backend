import { Module } from '@nestjs/common';
import { InterviewQuestionsService } from './interview-questions.service';
import { InterviewQuestionsController } from './interview-questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewEvl } from 'src/interviewsEvl/entities/interviews-evl.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { CreateInterviewQuestion } from './use-cases/create.use-case';
import { DeleteInterviewQuestion } from './use-cases/delete.use-case';
import { UpdateInterviewQuestion } from './use-cases/update.use-case';
import { GetAllInterviewQuestions } from './use-cases/getAll.use-case';
import { GetInterviewEvlById } from 'src/interviewsEvl/use-cases/getById.use-case';
import { GetInterviewQuestionById } from './use-cases/getById.use-case';

@Module({
  controllers: [InterviewQuestionsController],
  providers: [
    InterviewQuestionsService, 
    CreateInterviewQuestion,
    DeleteInterviewQuestion,
    UpdateInterviewQuestion,
    GetAllInterviewQuestions,
    GetInterviewQuestionById

  ],
  imports: [TypeOrmModule.forFeature([InterviewEvl, InterviewQuestion])],
  exports: [InterviewQuestionsService]
})
export class InterviewQuestionsModule {}
