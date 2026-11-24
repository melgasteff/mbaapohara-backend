import { SectorGroup } from 'src/companies/sector-groups';
import { ReviewStatus } from '../../domain/model/review';
import { AnswerValue, SituationValue } from './review.dto';

// Respuestas de la API. La reseña pública nunca incluye el autor ni fechas exactas.

export class NamedRefDTO {
    id: number;
    nombre: string;
}

export class OfficeRefDTO extends NamedRefDTO {
    ciudad: string;
}

export class AnswerDTO {
    codigo: string;
    respuesta: AnswerValue;
}

/** Resultado de publicar o editar: lo que la persona ve al terminar el asistente. */
export class SubmitResultDTO {
    id: number;
    estado: ReviewStatus;
    /** Categoría de moderación que motivó el rechazo o la revisión. */
    categoria?: string;
    /** Qué corregir o por qué se revisa (política de moderación, sección 7). */
    motivo?: string;
}

export class PublicReviewDTO {
    id: number;
    empresa: NamedRefDTO;
    local: OfficeRefDTO;
    /** `null` si el cargo es una propuesta que el administrador todavía no aprobó («Otro cargo»). */
    cargo: string | null;
    situacion: SituationValue;
    ultimoAnio: number | null;
    tipoContrato: NamedRefDTO;
    modalidad: NamedRefDTO;
    calificacion: number;
    loBueno: string;
    aMejorar: string;
    respuestas: AnswerDTO[];
    /** Mes de publicación, «2026-11». */
    mesPublicacion: string;
}

export class PublicReviewPageDTO {
    data: PublicReviewDTO[];
    total: number;
    page: number;
    pageSize: number;
}

export class NamedCountDTO extends NamedRefDTO {
    cantidad: number;
}

export class OfficeCountDTO extends NamedCountDTO {
    ciudad: string;
}

export class SituationCountDTO {
    valor: SituationValue;
    cantidad: number;
}

export class NamedFacetDTO {
    /** Reseñas sin aplicar este filtro: es el conteo de «todos». */
    total: number;
    opciones: NamedCountDTO[];
}

export class OfficeFacetDTO {
    total: number;
    opciones: OfficeCountDTO[];
}

export class SituationFacetDTO {
    total: number;
    opciones: SituationCountDTO[];
}

/** Conteos por opción de cada filtro del perfil. Cada uno aplica los demás filtros y no el propio. */
export class ReviewFacetsDTO {
    /** Reseñas con todos los filtros. */
    total: number;
    local: OfficeFacetDTO;
    /** Solo cargos aprobados: puede sumar menos que el total. */
    cargo: NamedFacetDTO;
    tipoContrato: NamedFacetDTO;
    modalidad: NamedFacetDTO;
    situacion: SituationFacetDTO;
}

export class MyJobDTO {
    id: number;
    descripcion: string;
    /** `false` mientras el cargo propuesto espera la aprobación del administrador. */
    aprobado: boolean;
}

export class MyReviewVersionDTO {
    numero: number;
    estado: ReviewStatus;
    categoria: string | null;
    motivo: string | null;
    cargo: MyJobDTO;
    situacion: SituationValue;
    ultimoAnio: number | null;
    tipoContrato: NamedRefDTO;
    modalidad: NamedRefDTO;
    calificacion: number;
    loBueno: string;
    aMejorar: string;
    respuestas: AnswerDTO[];
    fecha: Date;
}

export class MyCompanyDTO extends NamedRefDTO {
    /** Grupo de rubro: define el color del sello. */
    grupo: SectorGroup;
}

export class MyReviewDTO {
    id: number;
    empresa: MyCompanyDTO;
    local: OfficeRefDTO;
    /** Hay una versión publicada visible (puede ser anterior a la última). */
    publicada: boolean;
    ultimaVersion: MyReviewVersionDTO;
}
