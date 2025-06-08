import { BenefitEvaluation } from "src/evaluations/domain/model/benefit-evaluation.entity";
import { BenefitEvaluationRepository } from "src/evaluations/domain/repository/benefit-evaluation.repository";

export class GetAllBenefitEvaluationsUseCase {
    constructor(
        private benefitEvalRepo: BenefitEvaluationRepository
    ){}

    public async execute(): Promise<BenefitEvaluation[]>{
        return this.benefitEvalRepo.getAll();
    }
}