import { Office } from "../model/office.entity";

export abstract class OfficeRepository {
  abstract getAll(): Promise<Office[]>;
  abstract getById(id: number): Promise<Office | null>;
  abstract getByName(officeName : string) : Promise<number>;
  abstract count(): Promise<number>;
}
