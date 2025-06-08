import { BenefitEvaluation } from "../model/benefit-evaluation.entity";
import { Benefit } from "../model/benefit.entity";
import { NewBenefitEvaluation } from "../model/new-benefit-evaluation.entity";

export abstract class BenefitEvaluationRepository {
  abstract create(idEvaluacion:number, newBenefitEval: NewBenefitEvaluation): Promise<BenefitEvaluation>;
  abstract getAll(): Promise<BenefitEvaluation[]>;
  abstract getById(id: number): Promise<BenefitEvaluation | null>;
  abstract getByIds(benefitIds: number[]): Promise<Benefit[]>
  abstract update(id: number, benefitEval: Partial<BenefitEvaluation>): Promise<BenefitEvaluation>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}