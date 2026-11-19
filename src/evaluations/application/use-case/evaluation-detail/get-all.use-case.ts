import { EvaluationDetail } from "src/evaluations/domain/model/evaluation-detail.entity";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { Page, PageRequest } from "src/shared/domain/page";

export class GetAllEvaluationDetailsUseCase {
    constructor(
        private evaluationDetailRepo: EvaluationDetailRepository
    ) { }

    public async execute(evaluationid: number, request: PageRequest): Promise<Page<EvaluationDetail>> {
        return this.evaluationDetailRepo.getPage(evaluationid, request);
    }
}
