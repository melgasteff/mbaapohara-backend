import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";
import { BenefitEvaluationNotFoundException } from "../../exception/benefit-evaluation/benefit-evaluation-not-found.exception";

export class UpdateBenefitEvaluatonUseCase {
    constructor(
        private readonly benefitEvalRepo: BenefitEvaluationRepository,
    ) { }

    async execute(
        idEvaluacion: number,
        benefits: Benefit[],
    ): Promise<BenefitEvaluation> {
        try {
            const salaryEvlFound = await this.benefitEvalRepo.getById(idEvaluacion);

            if (!salaryEvlFound) {
                throw new BenefitEvaluationNotFoundException(idEvaluacion);
            }

            const benefitEvlToUpdate = new BenefitEvaluation(
                idEvaluacion,
                benefits
            );

            return await this.benefitEvalRepo.update(idEvaluacion, benefitEvlToUpdate);
        } catch (error) {
            console.error("Error al actualizar la evaluacion de benficio:", error);
            throw new error
        }

    }
}