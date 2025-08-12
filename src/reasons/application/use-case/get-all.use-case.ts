import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { NoReasonsFoundException } from "../exception/no-reasons-found.exception";

export class GetAllReasonsUseCase {

    constructor(
        private reasonRepo: ReasonRepository
    ) { }

    public async execute(): Promise<Reason[]> {
        const allReasons = await this.reasonRepo.getAll();
        if (allReasons.length === 0) throw new NoReasonsFoundException();
        return allReasons;
    }
}