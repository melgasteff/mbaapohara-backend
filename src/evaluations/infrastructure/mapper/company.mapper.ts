import { Company } from "src/evaluations/domain/model/company.entity";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";

export class CompanyMapper{
    static toDomain(companyTypeOrm: CompanyTypeORMModel): Company{
        return new Company(companyTypeOrm.id, companyTypeOrm.nombre);
    }

    static toTypeORMModel(newCompany: Company): CompanyTypeORMModel{
        const companyTypeOrm = new CompanyTypeORMModel();
        companyTypeOrm.id = newCompany.getId()
        companyTypeOrm.nombre = newCompany.getNombre();
        return companyTypeOrm;
    }
}