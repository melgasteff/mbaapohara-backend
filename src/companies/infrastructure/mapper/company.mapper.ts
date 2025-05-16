import { Company } from "src/companies/domain/model/company.entity";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";
import { NewCompany } from "src/companies/domain/model/new-comapny.entity";

export class CompanyMapper{
    static toDomain(companyTypeOrm: CompanyTypeORMModel): Company{
        return new Company(companyTypeOrm.id, companyTypeOrm.nombre, companyTypeOrm.rubro);
    }

    static toTypeORMModel(newCompany: NewCompany): CompanyTypeORMModel{
        const companyTypeOrm = new CompanyTypeORMModel();
        companyTypeOrm.nombre = newCompany.getNombre();
        companyTypeOrm.rubro = newCompany.getRubro();
        return companyTypeOrm;
    }
}