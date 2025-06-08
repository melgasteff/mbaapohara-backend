import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { NewBenefitEvaluation } from "src/evaluations/domain/model/new-benefit-evaluation.entity";


export class CreateBenefitEvaluationUseCase {
    constructor(
        private benefitEvlRepo: BenefitEvaluationRepository,
        private evaluationRepo: EvaluationRepository
    ) { }

    async execute(idEvaluacion: number, benefitIds: number[]): Promise<BenefitEvaluation> {
  const evaluation = await this.evaluationRepo.getById(idEvaluacion);
  if (!evaluation) throw new EvaluationNotFoundException(idEvaluacion);

  const benefits = await this.benefitEvlRepo.getByIds(benefitIds); // <-- repositorio debe implementarlo
  const newBenefitsEvl = new NewBenefitEvaluation(benefits);
  return await this.benefitEvlRepo.create(idEvaluacion, newBenefitsEvl);
}
}