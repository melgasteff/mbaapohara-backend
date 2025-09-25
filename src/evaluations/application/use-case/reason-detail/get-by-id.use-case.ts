import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity"
import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository"
import { AttributeNotFoundException } from "../../exception/reason-detail/attribute-not.found.exception"

export class GetReasonDetailByIdUseCase {
    constructor(
        private readonly reasonDetailRepo:  ReasonDetailRepository
    ) { }

    async execute(idevaluation: number, idReason:number): Promise<ReasonDetail> {
        const reasonDetail = await this.reasonDetailRepo.getById(idevaluation, idReason)
        if (!reasonDetail) throw new AttributeNotFoundException('Reason Detail')
        return reasonDetail
    }
}