import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository";

export class CountReasonDetailsUseCase {
    constructor(
        private readonly reasonDetailRepo: ReasonDetailRepository
    ) { }

    execute():Promise<number>{
        return this.reasonDetailRepo.count()
    }
}