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
        const allEvaluationDetails = await this.evaluationDetailRepo.getAll(request.idevaluation);
        const item = await this.itemRepo.getById(request.iditem);
        const evaluation = await this.evaluationRepo.getById(request.idevaluation)

        const evaluationDetail = await this.evaluationDetailRepo.getById(request.id)
        if (!evaluationDetail) { throw new EvaluationDetailNotFoundException(request.id); }

        const repeatedEvaluationDetail = allEvaluationDetails.
            find((detail) =>
                detail.getId() !== request.id
                && detail.getEvaluation().getId() === evaluation.getId()
                && detail.getItem().getId() === item.getId()
                && detail.getRating() === request.rating
            );

        if (repeatedEvaluationDetail) { throw new EvaluationDetailAlreadyExistsException() }

        const updatedEvaluationDetail = new EvaluationDetail(
            request.id,
            evaluation,
            item,
            request.rating,
            request.extraReason
        )

        return this.evaluationDetailRepo.update(request.id, updatedEvaluationDetail)
    }
}