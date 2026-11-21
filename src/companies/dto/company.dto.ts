import { OfficeDTO } from '../offices/dto/office.dto';
import { Company } from '../company.entity';
import { Office } from '../offices/office.entity';
import { ProposalStatus } from 'src/shared/domain/proposal-status';

export class CompanySectorDTO {
    id: number;
    codigoCiiu: string;
    nombre: string;
}

export class CompanyDTO {
    id: number;
    nombre: string;
    rubro: CompanySectorDTO;
    estado: ProposalStatus;

    static from(company: Company): CompanyDTO {
        return {
            id: company.id,
            nombre: company.nombre,
            rubro: company.rubro
                ? { id: company.rubro.id, codigoCiiu: company.rubro.codigoCiiu, nombre: company.rubro.nombre }
                : { id: company.idRubro, codigoCiiu: null, nombre: null },
            estado: company.estado,
        };
    }
}

export class CompanyDetailDTO extends CompanyDTO {
    /** Locales aprobados de la empresa. */
    locales: OfficeDTO[];

    static fromDetail(company: Company, offices: Office[]): CompanyDetailDTO {
        return { ...CompanyDTO.from(company), locales: offices.map(OfficeDTO.from) };
    }
}

export class CompanyPageDTO {
    data: CompanyDTO[];
    total: number;
    page: number;
    pageSize: number;
}
