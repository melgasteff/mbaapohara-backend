import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { ItemRepository } from "src/evaluations/domain/repository/item.repository";
import { CreateEvaluationDetailRequest } from "../../request/create-evaluation-detail.request";
import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { NewEvaluationDetail } from "src/evaluations/domain/model/new-evaluation-detail.entity";
import { EvaluationDetailAlreadyExistsException } from "../../exception/evaluation-detail/evaluation-detail-already-exists.exception";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";


export class CreateEvaluationDetailUseCase {
  constructor(
    private readonly evaluationDetailRepo: EvaluationDetailRepository,
    private readonly itemRepo: ItemRepository,
    private readonly evaluationRepo: EvaluationRepository
  ) {}

  async execute(request: CreateEvaluationDetailRequest): Promise<EvaluationDetail> {
    const allEvaluationDetail = await this.evaluationDetailRepo.getAll(request.idevaluation);
    const allEvaluations = await this.evaluationRepo.getAll()
    const item = await this.itemRepo.getById(request.iditem);

    const evaluation = allEvaluations.find((evalu) => evalu.getId() == request.idevaluation);
    if(evaluation == null) throw new EvaluationNotFoundException(request.idevaluation)

    const evaluationDetailFound = allEvaluationDetail.find(
      (detail) =>
        detail.getItem().getId() === item.getId() &&
        detail.getEvaluation().getId() === evaluation.getId() &&
        detail.getRating() === request.rating 
    );

    if (evaluationDetailFound) {
      throw new EvaluationDetailAlreadyExistsException();
    }

    const newEvaluationDetail = new NewEvaluationDetail(
      evaluation, 
      item, 
      request.rating, 
      request.extraReason
    );

    return await this.evaluationDetailRepo.create(newEvaluationDetail);
  }
}