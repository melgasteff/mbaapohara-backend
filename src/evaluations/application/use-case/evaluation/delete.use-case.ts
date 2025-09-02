import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { EvaluationInUseException } from "../../exception/evaluation/evaluation-in-use.exception";

export class DeleteEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ) { }

    async execute(id: number) {
        try {
            const evaluation = await this.evaluationRepo.getById(id)
            if (!evaluation) { throw new EvaluationNotFoundException(id) }
            await this.evaluationRepo.delete(id)
        } catch (error) {
            if (error instanceof Error && error.message.includes('foreign key')) throw new EvaluationInUseException();
            throw new error
        }
    }
}