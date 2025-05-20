import { Company } from "../model/ company.entity";

export abstract class CompanyRepository{
    abstract findById(id: number): Promise<Company>;
    abstract findByName(descripcion: string): Promise<Company>;
}