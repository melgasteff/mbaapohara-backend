import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { EvaluationDetailNotFoundException } from "../../exception/evaluation-detail/evaluation-detail-not-found.exception";

export class DeleteEvaluationDetailUseCase {
    constructor(
        private readonly evaluationDetailRepo: EvaluationDetailRepository
    ) { }

    async execute(id: number) {
        try {
            const evaluationDetail = await this.evaluationDetailRepo.getById(id)
            if (!evaluationDetail) { throw new EvaluationDetailNotFoundException(id) }
            await this.evaluationDetailRepo.delete(id)
        } catch (error) {
            throw new error
        }
    }
}