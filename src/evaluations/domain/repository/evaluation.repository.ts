import { Evaluation } from "../model/evaluation.entity";
import { NewEvaluation } from "../model/new-evaluation.entity";
import { SalaryEvaluation } from "../model/salary-evaluation.entity";

export abstract class EvaluationRepository {
  abstract create(newEvaluation: NewEvaluation): Promise<Evaluation>;
  abstract getAll(): Promise<Evaluation[]>;
  abstract getById(id: number): Promise<Evaluation | null>;
  abstract update(id: number, evaluation: Partial<Evaluation>): Promise<Evaluation>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
  abstract updateSalaryEvaluation(evaluationId: number, salaryEvaluation: SalaryEvaluation): Promise<void>
}