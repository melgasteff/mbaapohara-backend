import { ProposalStatus } from '../../proposal-status';
import { Office } from '../office.entity';

export class OfficeCityDTO {
    id: number;
    nombre: string;
    idDepartamento: number;
}

export class OfficeDTO {
    id: number;
    nombre: string;
    idEmpresa: number;
    ciudad: OfficeCityDTO;
    direccionReferencia: string | null;
    estado: ProposalStatus;

    static from(office: Office): OfficeDTO {
        return {
            id: office.id,
            nombre: office.nombre,
            idEmpresa: office.idEmpresa,
            ciudad: office.ciudad
                ? { id: office.ciudad.id, nombre: office.ciudad.nombre, idDepartamento: office.ciudad.idDepartamento }
                : { id: office.idCiudad, nombre: null, idDepartamento: null },
            direccionReferencia: office.direccionReferencia,
            estado: office.estado,
        };
    }
}

export class OfficePageDTO {
    data: OfficeDTO[];
    total: number;
    page: number;
    pageSize: number;
}
