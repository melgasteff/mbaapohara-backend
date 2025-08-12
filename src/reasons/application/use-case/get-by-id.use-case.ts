import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { ReasonNotFoundException } from "../exception/reason.not-found.exception";

export class GetReasonByIdUseCase {
    constructor(
        private readonly reasonRepo: ReasonRepository
    ) { }

    async execute(id: number): Promise<Reason> {

        const reasonFound = await this.reasonRepo.getById(id)
        if (!reasonFound) throw new ReasonNotFoundException(id)
        return reasonFound
    }
}