import { NewOffice } from "../model/new-office.entity";
import { Office } from "../model/office.entity";

export abstract class OfficeRepository {
  abstract create(newOffice: NewOffice): Promise<Office>;
  abstract getAll(): Promise<Office[]>;
  abstract getById(id: number): Promise<Office | null>;
  abstract update(id: number, office: Partial<Office>): Promise<Office>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}
