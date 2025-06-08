import { Contract } from "../model/contract.entity";

export abstract class ContractRepository {
  abstract getAll(): Promise<Contract[]>;
  abstract getById(id: number): Promise<Contract | null>;
}