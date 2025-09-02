import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { UpdateEvaluationDetailRequest } from "../../request/update-evaluation-detail.request";
import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationDetailNotFoundException } from "../../exception/evaluation-detail/evaluation-detail-not-found.exception";
import { EvaluationDetailAlreadyExistsException } from "../../exception/evaluation-detail/evaluation-detail-already-exists.exception";
import { ItemRepository } from "src/evaluations/domain/repository/item.repository";

export class UpdateEvaluationDetailUseCase {
    constructor(
        private readonly evaluationDetailRepo: EvaluationDetailRepository,
        private readonly evaluationRepo: EvaluationRepository,
        private readonly itemRepo: ItemRepository,
    ) { }

    async execute(request: UpdateEvaluationDetailRequest): Promise<EvaluationDetail> {
        try {
            const allEvaluationDetails = await this.evaluationDetailRepo.getAll(request.idevaluation);
            const item = await this.itemRepo.getById(request.iditem);
            const evaluation = await this.evaluationRepo.getById(request.idevaluation)
            const evaluationDetail = await this.evaluationDetailRepo.getById(request.id)

            const repeatedEvaluationDetail = allEvaluationDetails.
                find((evaluationDetail) =>
                    evaluationDetail.getId() !== request.id
                && evaluationDetail.getEvaluation().getId() === evaluation.getId()
                && evaluationDetail.getItem().getId() === item.getId()
                && evaluationDetail.getRating() === request.rating
                );
            if (!evaluationDetail) { throw new EvaluationDetailNotFoundException(request.id); }
            if (repeatedEvaluationDetail) { throw new EvaluationDetailAlreadyExistsException() }

            const updatedEvaluationDetail = new EvaluationDetail(
                request.id,
                evaluation, 
                item, 
                request.rating, 
                request.extraReason
            )

            return this.evaluationDetailRepo.update(request.id, updatedEvaluationDetail)
        } catch (error) {
            console.error("Error al actualizar el detalle de evaluacion:", error);
            throw error
        }
    }
}