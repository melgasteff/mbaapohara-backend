import { Office } from "src/offices/domain/model/office.entity"
import { OfficeDTO } from "../dto/office.dto"

export class OfficeDTOMapper {

    static toDTO(office: Office): OfficeDTO {
        return {
            id: office.getId(),
            nombre: office.getNombre(),
            email: office.getEmail(),
            telefono: office.getTelefono(),
            cantEmpleados: office.getCantEmpleados(),
            idCiudad: office.getIdCiudad(),
            idempresa: office.getEmpresa().getId()
        }
    }
}