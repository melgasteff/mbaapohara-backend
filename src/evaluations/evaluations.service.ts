import { Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { GetAllEvaluations } from './use-cases/getAll.use-case';
import { UpdateEvaluation } from './use-cases/update.use-case';
import { CreateEvaluation } from './use-cases/create.use-case';
import { DeleteEvaluation } from './use-cases/delete.use-case';
import { GetEvaluationById } from './use-cases/getById.use-case';

@Injectable()
export class EvaluationsService {
  constructor(
    private getAllEvaluationsUC : GetAllEvaluations, 
    private updateEvaluationUC : UpdateEvaluation, 
    private createEvaluationUC : CreateEvaluation,
    private deleteEvaluationUC : DeleteEvaluation, 
    private getEvaluationByIdUC : GetEvaluationById
  ){}
  
  createEvaluation(evaluation: CreateEvaluationDto) {
    return this.createEvaluationUC.execute(evaluation);
  }

  getAllEvaluations() {
    return this.getAllEvaluationsUC.execute()
  }

  getEvaluationById(id: number) {
    return this.getEvaluationByIdUC.execute(id)
  }

  updateEvaluation(id: number, evaluation: UpdateEvaluationDto) {
    return this.updateEvaluationUC.execute(id, evaluation);
  }

  deleteEvauation(id: number) {
    return this.deleteEvaluationUC.execute(id)
  }
}
