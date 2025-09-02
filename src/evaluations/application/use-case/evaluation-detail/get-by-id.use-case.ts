import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { EvaluationDetailNotFoundException } from "../../exception/evaluation-detail/evaluation-detail-not-found.exception";

export class GetEvaluationDetailByIdUseCase {
    constructor(
        private readonly evaluationDetailRepo: EvaluationDetailRepository
    ) { }

    async execute(id: number): Promise<EvaluationDetail> {
        const evaluationFound = await this.evaluationDetailRepo.getById(id)
        if (!evaluationFound) throw new EvaluationDetailNotFoundException(id)
        return evaluationFound
    }
}