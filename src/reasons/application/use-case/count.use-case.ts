import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";

export class CountReasonsUseCase {
    constructor(
        private readonly reasonRepo: ReasonRepository
    ) { }

    execute(): Promise<number>{
        return this.reasonRepo.count()
    }
}