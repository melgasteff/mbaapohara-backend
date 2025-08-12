import { NewReason } from "../model/new-reason.entity";
import { Reason } from "../model/reason.entity";

export abstract class ReasonRepository {
    abstract create(newReason: NewReason): Promise<Reason>
    abstract getAll(): Promise<Reason[]>
    abstract getById(id: number): Promise<Reason | null>;
    abstract update(id: number, reason: Partial<Reason>): Promise<Reason>;
    abstract delete(id: number): Promise<void>;
    abstract count(): Promise<number>;
}