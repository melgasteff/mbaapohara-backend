import { OfficeDTO } from '../offices/dto/office.dto';
import { SectorGroup } from '../sector-groups';
import { CompanyDTO } from './company.dto';

// Resumen de reseñas de una empresa. Solo cuentan las publicadas (vista resenas_publicas); nunca lleva el autor.

/** Cumplimiento de una categoría de criterios. «No sé o no aplica» no se cuenta. */
export class TopicDTO {
    codigo: string;
    nombre: string;
    /** Porcentaje de respuestas «Sí», entero. */
    porcentajeSi: number;
    /** Reseñas que respondieron algo de la categoría, sin contar «No sé». */
    resenas: number;
}

export class CompanySummaryDTO extends CompanyDTO {
    cantidadResenas: number;
    /** Promedio con un decimal; `null` sin reseñas. */
    promedio: number | null;
    /** Primera categoría de criterios (en el orden de administración); `null` si no llega a 3 reseñas. */
    temaPrincipal: TopicDTO | null;
    /** Logo con permiso de la empresa. Todavía no se carga ninguno: siempre `null`. */
    logoUrl: string | null;
}

export class CompanySummaryPageDTO {
    data: CompanySummaryDTO[];
    total: number;
    page: number;
    pageSize: number;
}

export class StarsCountDTO {
    estrellas: number;
    cantidad: number;
}

export class OfficeSummaryDTO extends OfficeDTO {
    cantidadResenas: number;
}

export class CompanyDetailDTO extends CompanySummaryDTO {
    /** De 5 a 1 estrellas; vacía con menos de 3 reseñas. */
    distribucion: StarsCountDTO[];
    /** Categorías con 3 reseñas o más, en el orden de administración; vacía con menos de 3 reseñas. */
    temas: TopicDTO[];
    /** Locales aprobados de la empresa. */
    locales: OfficeSummaryDTO[];
}

export class GroupCountDTO {
    grupo: SectorGroup;
    cantidad: number;
}

export class DepartmentCountDTO {
    id: number;
    nombre: string;
    cantidad: number;
}

export class CityCountDTO extends DepartmentCountDTO {
    idDepartamento: number;
}

export class GroupFacetDTO {
    /** Empresas sin aplicar este filtro: es el conteo de «todos». */
    total: number;
    opciones: GroupCountDTO[];
}

export class DepartmentFacetDTO {
    total: number;
    opciones: DepartmentCountDTO[];
}

export class CityFacetDTO {
    total: number;
    opciones: CityCountDTO[];
}

export class ReviewsFacetDTO {
    total: number;
    con: number;
    sin: number;
}

/** Conteos del directorio. Cada uno aplica los demás filtros y no el propio. */
export class CompanyFacetsDTO {
    /** Empresas con todos los filtros. */
    total: number;
    /** Reseñas publicadas de esas empresas; con departamento o ciudad, solo las de los locales de ese lugar. */
    experiencias: number;
    grupos: GroupFacetDTO;
    departamentos: DepartmentFacetDTO;
    ciudades: CityFacetDTO;
    resenas: ReviewsFacetDTO;
}
