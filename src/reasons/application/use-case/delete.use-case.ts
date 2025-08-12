import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { ReasonNotFoundException } from "../exception/reason.not-found.exception";
import { ReasonInUseException } from "../exception/reason-in-use.exception";
import { ForeignKeyConstraintViolationException } from "../exception/foreing-key-constraint-violation.exception";

export class DeleteReasonUseCase {
    constructor(
        private readonly reasonRepo: ReasonRepository
    ) { }
     async execute(id: number): Promise<void> {
        const reason = await this.reasonRepo.getById(id)
        if (!reason) throw new ReasonNotFoundException(id)

        try {
            await this.reasonRepo.delete(id)
        } catch (err) {
            if (err instanceof ForeignKeyConstraintViolationException) {
                throw new ReasonInUseException(id)
            }
            throw err
        }
    }
}