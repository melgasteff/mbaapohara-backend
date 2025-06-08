import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { BenefitEvaluationNotFoundException } from "../../exception/benefit-evaluation/benefit-evaluation-not-found.exception";

export class GetBenefitEvaluationByIdUseCase {
    constructor(
        private readonly benefirEvalRepo: BenefitEvaluationRepository
    ) { }

    async execute(id: number): Promise<BenefitEvaluation> {
        try {
            const benefitEvalFound = await this.benefirEvalRepo.getById(id)
            if (!benefitEvalFound) throw new BenefitEvaluationNotFoundException(id)
            return benefitEvalFound
        } catch (error) {
            console.error("Error al obtener la evaluacion de beneficios", error);
            throw error;
        }
    }
}