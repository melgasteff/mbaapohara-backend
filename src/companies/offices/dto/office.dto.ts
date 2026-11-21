import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { Office } from '../office.entity';

export class OfficeCityDTO {
    id: number;
    nombre: string;
    idDepartamento: number;
}

export class OfficeCompanyDTO {
    id: number;
    nombre: string;
}

export class OfficeDTO {
    id: number;
    nombre: string;
    idEmpresa: number;
    /** Empresa del local; solo en los listados de administración. */
    empresa?: OfficeCompanyDTO;
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
            ...(office.empresa ? { empresa: { id: office.empresa.id, nombre: office.empresa.nombre } } : {}),
        };
    }
}

export class OfficePageDTO {
    data: OfficeDTO[];
    total: number;
    page: number;
    pageSize: number;
}
