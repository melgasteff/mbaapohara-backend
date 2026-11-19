import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { Page, PageRequest } from "src/shared/domain/page";

export class GetAllEvaluationsUseCase {
    constructor(
        private evaluationRepo: EvaluationRepository
    ) { }

    public async execute(request: PageRequest): Promise<Page<Evaluation>> {
        return this.evaluationRepo.getPage(request);
    }
}
