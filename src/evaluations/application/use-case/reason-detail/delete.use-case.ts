import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository";
import { AttributeNotFoundException } from "../../exception/reason-detail/attribute-not.found.exception";

export class DeleteReasonDetailUseCase {
    constructor(
        private readonly reasonDetailRepo: ReasonDetailRepository
    ) { }

    async execute(idEvaluationDetail: number, idReason: number): Promise<void> {
        const allReasonDetail = this.reasonDetailRepo.getAll(idEvaluationDetail, idReason)
        const reasonDetail = (await allReasonDetail).find(
            (reason) => reason.getEvaluationDetail().getId() == idEvaluationDetail &&
                reason.getReason().getId() == idReason
        )
        if (!reasonDetail) throw new AttributeNotFoundException('ReasonDetail')
        await this.reasonDetailRepo.delete(idEvaluationDetail, idReason)
    }
}