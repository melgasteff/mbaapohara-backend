import { Reason } from "../model/reason.entity";

export abstract class ReasonRepository {
    abstract getAll(): Promise<Reason[]>
    abstract getById(id: number): Promise<Reason | null>
}