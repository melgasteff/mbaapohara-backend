import { Company } from '../company.entity';
import { SectorGroup, sectorGroup } from '../sector-groups';
import { ProposalStatus } from 'src/shared/domain/proposal-status';

export class CompanySectorDTO {
    id: number;
    codigoCiiu: string;
    nombre: string;
    /** Grupo de rubro; define el color del sello. */
    grupo: SectorGroup;
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
                ? { id: company.rubro.id, codigoCiiu: company.rubro.codigoCiiu, nombre: company.rubro.nombre, grupo: sectorGroup(company.rubro.codigoCiiu) }
                : { id: company.idRubro, codigoCiiu: null, nombre: null, grupo: sectorGroup(null) },
            estado: company.estado,
        };
    }
}

export class CompanyPageDTO {
    data: CompanyDTO[];
    total: number;
    page: number;
    pageSize: number;
}
