import { Benefit } from "../model/benefit.entity";

export abstract class BenefitRepository{
    abstract getByIds(ids: number[]): Promise<Benefit[]>
}