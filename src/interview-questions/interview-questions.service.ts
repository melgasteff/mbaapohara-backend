import { Injectable } from '@nestjs/common';
import { CreateInterviewQuestionDto } from './dto/create-interview-question.dto';
import { UpdateInterviewQuestionDto } from './dto/update-interview-question.dto';
import { CreateInterviewQuestion } from './use-cases/create.use-case';
import { UpdateInterviewQuestion } from './use-cases/update.use-case';
import { DeleteInterviewQuestion } from './use-cases/delete.use-case';
import { GetAllInterviewQuestions } from './use-cases/getAll.use-case';
import { GetInterviewEvlById } from 'src/interviewsEvl/use-cases/getById.use-case';
import { GetInterviewQuestionById } from './use-cases/getById.use-case';

@Injectable()
export class InterviewQuestionsService {
  constructor(
    private createInterviewQuestionUC : CreateInterviewQuestion,
    private updateInterviewQuestionUC: UpdateInterviewQuestion,
    private deleteInterviewQuestionUC : DeleteInterviewQuestion,
    private getAllInterviewQuestionUC : GetAllInterviewQuestions,
    private getInterviewQuestionByIdUC: GetInterviewQuestionById
  ){}
  createInterviewQuestion(interviewQuestion: CreateInterviewQuestionDto) {
    return this.createInterviewQuestionUC.execute(interviewQuestion);
  }

  getAllInterviewQuestions () {
    return this.getAllInterviewQuestionUC.execute();
  }

  getInterviewQuestionById(id: number) {
    return this.getInterviewQuestionByIdUC.execute(id);
  }

  updateInterviewQuestion(id: number, interviewQuestion: UpdateInterviewQuestionDto) {
    return this.updateInterviewQuestionUC.execute(id, interviewQuestion);
  }

  deleteInterviewQuestion(id: number) {
    return this.deleteInterviewQuestionUC.execute(id);
  }
}
