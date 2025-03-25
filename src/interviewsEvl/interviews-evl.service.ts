import { Injectable } from '@nestjs/common';
import { CreateInterviewsEvlDto } from './dto/create-interviews-evl.dto';
import { UpdateInterviewsEvlDto } from './dto/update-interviews-evl.dto';
import { CreateInterviewEvl } from './use-cases/create.use-case';
import { UpdateInterviewEvl } from './use-cases/update.use-case';
import { DeleteInterviewEvl } from './use-cases/delete.use-case';
import { GetAllInterviwsEvl } from './use-cases/getAll.use-case';
import { GetInterviewEvlById } from './use-cases/getById.use-case';

@Injectable()
export class InterviewsEvlService {
  constructor(
    private createInterviewEvlUC : CreateInterviewEvl,
    private updateInterviewEvlUC : UpdateInterviewEvl,
    private deleteInterviewEvlUC : DeleteInterviewEvl,
    private getAllInterviewEvlUC : GetAllInterviwsEvl,
    private getInterviewEvaluationByIdUC: GetInterviewEvlById
  ){}
  createInterviewEvl(interviewEvl: CreateInterviewsEvlDto) {
    return this.createInterviewEvlUC.execute(interviewEvl);
  }

  getAllInterviewEvl() {
    return this.getAllInterviewEvlUC.execute();
  }

  getInterviewEvlById(id: number) {
    return this.getInterviewEvaluationByIdUC.execute(id);
  }

  updateInterviewEvl(id: number, interviewEvl: UpdateInterviewsEvlDto) {
    return this.updateInterviewEvlUC.execute(id,interviewEvl);
  }

  deleteInterviewEvl(id: number) {
    return this.deleteInterviewEvlUC.execute(id);
  }
}
