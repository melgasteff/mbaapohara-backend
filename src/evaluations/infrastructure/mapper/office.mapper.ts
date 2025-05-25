import { Office } from "src/evaluations/domain/model/office.entity";
import { OfficeTypeORMModel } from "../typeorm/model/office.typeorm.model";
import { CompanyMapper } from "./company.mapper";


export class OfficeMapper {
    static toDomain(officeTypeOrm: OfficeTypeORMModel): Office {
        const company = CompanyMapper.toDomain(officeTypeOrm.empresa);

        return new Office(officeTypeOrm.id, officeTypeOrm.nombre, officeTypeOrm.email, officeTypeOrm.telefono, officeTypeOrm.cantEmpleados, officeTypeOrm.idCiudad, company);
    }

    static toTypeORMModel(newOffice: Office): OfficeTypeORMModel {
        const officeTypeorm = new OfficeTypeORMModel();
        officeTypeorm.id = newOffice.getId();
        officeTypeorm.nombre = newOffice.getNombre();
        officeTypeorm.email = newOffice.getEmail();
        officeTypeorm.telefono = newOffice.getTelefono();
        officeTypeorm.cantEmpleados= newOffice.getCantEmpleados();
        officeTypeorm.idCiudad = newOffice.getIdCiudad()
        officeTypeorm.empresa = CompanyMapper.toTypeORMModel(newOffice.getEmpresa());
        return officeTypeorm;
    }
}