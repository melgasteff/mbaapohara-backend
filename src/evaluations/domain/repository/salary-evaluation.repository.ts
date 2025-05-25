import { NewSalaryEvaluation } from "../model/new-salary-evaluation.entity";
import { SalaryEvaluation } from "../model/salary-evaluation.entity";

export abstract class SalaryEvaluationRepository {
  abstract create(newSalaryEvl: NewSalaryEvaluation): Promise<SalaryEvaluation>;
  abstract getAll(): Promise<SalaryEvaluation[]>;
  abstract getById(id: number): Promise<SalaryEvaluation | null>;
  abstract update(id: number, salaryEvl: Partial<SalaryEvaluation>): Promise<SalaryEvaluation>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}
