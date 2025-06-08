import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { BenefitEvaluationNotFoundException } from "../../exception/benefit-evaluation/benefit-evaluation-not-found.exception";

export class DeleteBenefitsEvaluationUseCase {
    constructor(
        private readonly benefitEvlRepo: BenefitEvaluationRepository
    ) { }

    async execute(id: number): Promise<void> {
        try {
            const benefitEval = await this.benefitEvlRepo.getById(id);

            if (!benefitEval) { throw new BenefitEvaluationNotFoundException(id); }

            await this.benefitEvlRepo.delete(id);
        } catch (error) {
            throw error
        }
    }
}