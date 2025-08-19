import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { ReasonNotFoundException } from "../exception/reason.not-found.exception";

export class UpdateReasonUseCase {
    constructor(
        private readonly reasonRepo: ReasonRepository
    ) { }

    async execute(id: number, reason: Reason): Promise<Reason> {
        const allReasons = await this.reasonRepo.getAll()
        const reasonFound = allReasons.find(reason => reason.getId() === id)
        if (!reasonFound) throw new ReasonNotFoundException(id)
        return this.reasonRepo.update(id, reason)
    }
}