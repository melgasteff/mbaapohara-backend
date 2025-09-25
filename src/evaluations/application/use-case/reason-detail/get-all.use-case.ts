import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity";
import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository";

export class GetAllReasonDetailsUseCase {

    constructor(
        private reasonDetaailRepo: ReasonDetailRepository
    ){}
    public async execute(idEvaluation: number, idReason: number): Promise<ReasonDetail[]>{
        return this.reasonDetaailRepo.getAll(idEvaluation, idReason);
    }
}