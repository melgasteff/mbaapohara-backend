import { ReasonDetail } from "../model/reason-detail.entity";

export abstract class ReasonDetailRepository {
    abstract create(newReasonDetail: ReasonDetail): Promise<ReasonDetail>
    abstract getById(idEvaluation: number, idReason:number): Promise<ReasonDetail>
    abstract getAll(idEvaluation:number, idReason: number): Promise<ReasonDetail[]>
    abstract delete(idEvaluation: number, idReason: number): Promise<void>;
    abstract count(): Promise<number>;
}