import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { BenefitRepository } from "src/evaluations/domain/repository/benefit.repository";

export class SetBenefitEvaluationUseCase {
  constructor(
    private benefitsRepo: BenefitRepository,
    private evaluationRepo: EvaluationRepository,
  ) { }

  async execute(idEvaluacion: number, benefitIds: number[]): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.getById(idEvaluacion);
    if (!evaluation) throw new EvaluationNotFoundException(idEvaluacion);

    const benefits = await this.benefitsRepo.getByIds(benefitIds); // <-- repositorio debe implementarlo
    return await this.evaluationRepo.updateBenefitEvaluation(idEvaluacion, benefits);
  }
}