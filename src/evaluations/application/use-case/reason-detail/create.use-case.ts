import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository";
import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity";
import { AttributeNotFoundException } from "../../exception/reason-detail/attribute-not.found.exception";
import { ReasonDetailAlreadyExistsException } from "../../exception/reason-detail/already-exist.exception";
import { ReasonRepository } from "src/evaluations/domain/repository/reason.repository";
import { ReasonDetailRequest } from "../../request/reason-detail.request";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";


export class CreateReasonDetailUseCase {
  constructor(
    private readonly reasonDetailRepo: ReasonDetailRepository,
    private readonly reasonRepo: ReasonRepository,
    private readonly evaluationDetailRepo: EvaluationDetailRepository
  ) {}

  async execute(request: ReasonDetailRequest): Promise<ReasonDetail> {
    const evaluationDetail = await this.evaluationDetailRepo.getById(request.idEvaluationDetail)
    if(!evaluationDetail) throw new AttributeNotFoundException('Evaluation')
    const allReasons = await this.reasonRepo.getAll()
    const reason = allReasons.find(
      (reasonFound)=> reasonFound.getId()== request.idReason
    )
    if(!reason) throw new AttributeNotFoundException('Reason')
    const allReasonDetails = await this.reasonDetailRepo.getAll(request.idEvaluationDetail, request.idReason)
    const reasonFound = allReasonDetails.find(
      (repeated) => repeated.getEvaluationDetail().getId() == request.idEvaluationDetail
      && repeated.getReason().getId() == request.idReason
    )
    if(reasonFound) throw new ReasonDetailAlreadyExistsException

    const newReasonDetail = new ReasonDetail(
      reason,
      evaluationDetail
    )
    return await this.reasonDetailRepo.create(newReasonDetail)
  }
}