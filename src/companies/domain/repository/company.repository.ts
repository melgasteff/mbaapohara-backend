import { Company } from "../model/company.entity";
import { NewCompany } from "../model/new-comapny.entity";

export abstract class CompanyRepository{
    abstract create(newCompany: NewCompany): Promise<Company>
    abstract getAll(): Promise<Company[]>
    abstract getById(id: number): Promise<Company>
    abstract update(id: number, company: Partial<Company>): Promise<Company>
    abstract delete(id: number): Promise<string>
    abstract count():Promise<number>
}