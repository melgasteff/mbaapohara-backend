import { Evaluation } from "src/evaluations/domain/model/evauation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";

export class GetEvaluationByIdUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ) { }

    async execute(id: number): Promise<Evaluation> {
        const evaluationFound = await this.evaluationRepo.getById(id)
        if (!evaluationFound) throw new EvaluationNotFoundException(id)
        return evaluationFound
    }
}