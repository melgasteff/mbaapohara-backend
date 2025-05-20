import { Company } from "src/offices/domain/model/ company.entity"
import { CompanyDTO } from "../dto/company.dto"

export class CompanyDTOMapper{
    static toDTO(company: Company): CompanyDTO{
        return { 
            id: company.getId(),
            nombre: company.getNombre(),
            rubro: company.getRubro()
        }
    }

    static toDomain(companyDto: CompanyDTO): Company{
        return new Company(companyDto.id, companyDto.nombre, companyDto.rubro)
    }
}