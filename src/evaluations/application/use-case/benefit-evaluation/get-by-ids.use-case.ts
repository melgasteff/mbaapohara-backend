import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { NewBenefitEvaluation } from "src/evaluations/domain/model/new-benefit-evaluation.entity";

export class GetBenefitsByIds{
    constructor(
        private readonly benefitEvlRepo: BenefitEvaluationRepository, 
        private readonly evaluationRepo:  EvaluationRepository
    ){}

    async execute(idEvaluacion: number, benefitIds: number[]): Promise<BenefitEvaluation> {
    const evaluation = await this.evaluationRepo.getById(idEvaluacion);
    if (!evaluation) throw new EvaluationNotFoundException(idEvaluacion);

    const benefits = await this.benefitEvlRepo.getByIds(benefitIds);
    const newBenefitsEvl = new NewBenefitEvaluation(benefits);

    return await this.benefitEvlRepo.create(idEvaluacion, newBenefitsEvl);
}
}