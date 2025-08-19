import { Company } from "../model/ company.entity";


export abstract class CompanyRepository{
    abstract getAll(): Promise<Company[]>
    abstract getById(id: number): Promise<Company>
    abstract getByName(companyName: string): Promise<number>
    abstract count():Promise<number>
}