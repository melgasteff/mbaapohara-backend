import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";

export class CountBenefitEvaluationsUseCase {
    constructor(
        private benefitEvalRepo : BenefitEvaluationRepository
    ){}

    execute(){
        return this.benefitEvalRepo.count();
    }
}