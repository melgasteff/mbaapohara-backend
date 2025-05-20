import { Company } from "src/offices/domain/model/ company.entity";
import { CompanyTypeORMModel } from "../typeorm/model/company.typeorm.model";

export class CompanyMapper{
    static toDomain(companyTypeOrm: CompanyTypeORMModel): Company{
        try {
            return new Company(companyTypeOrm.id, companyTypeOrm.nombre, companyTypeOrm.rubro);
        } catch (error) {
            console.log("Error al convertir a dominio: ", error)
            throw new error
        }
        
    }

    static toTypeORMModel(newCompany: Company): CompanyTypeORMModel{
        const companyTypeOrm = new CompanyTypeORMModel();
        companyTypeOrm.id = newCompany.getId()
        companyTypeOrm.nombre = newCompany.getNombre();
        companyTypeOrm.rubro = newCompany.getRubro();
        return companyTypeOrm;
    }
}