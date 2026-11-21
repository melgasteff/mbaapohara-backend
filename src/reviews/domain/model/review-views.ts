import { CriterionAnswer, ReviewStatus, WorkSituation } from './review';

// Vistas de lectura de la reseña. La pública nunca lleva el autor ni fechas exactas (reglas de anonimato).

export interface NamedRef {
    id: number;
    nombre: string;
}

export interface AnswerView {
    codigo: string;
    respuesta: CriterionAnswer;
}

/** Reseña publicada, tal como la ve cualquier persona. */
export interface PublicReview {
    id: number;
    empresa: NamedRef;
    local: NamedRef & { ciudad: string };
    /** Descripción del cargo, o `null` si es un cargo propuesto que el administrador todavía no aprobó. */
    cargo: string | null;
    situacion: WorkSituation;
    ultimoAnio: number | null;
    tipoContrato: NamedRef;
    modalidad: NamedRef;
    calificacion: number;
    loBueno: string;
    aMejorar: string;
    /** Respuestas a los criterios activos, en su orden. */
    respuestas: AnswerView[];
    /** Mes de publicación, «2026-11»: nunca el día. */
    mesPublicacion: string;
}

/** Filtros del listado público (RF5). Todos opcionales. */
export interface PublicReviewFilters {
    companyId?: number;
    officeId?: number;
    jobId?: number;
    cityId?: number;
    contractTypeId?: number;
    workModeId?: number;
    situation?: WorkSituation;
}

/** Última versión de una reseña propia, con todo lo necesario para mostrarla o editarla. */
export interface MyReviewVersion {
    numero: number;
    estado: ReviewStatus;
    categoria: string | null;
    /** Mensaje de la moderación para quien escribió (política, sección 7). */
    motivo: string | null;
    cargo: { id: number; descripcion: string; aprobado: boolean };
    situacion: WorkSituation;
    ultimoAnio: number | null;
    tipoContrato: NamedRef;
    modalidad: NamedRef;
    calificacion: number;
    loBueno: string;
    aMejorar: string;
    respuestas: AnswerView[];
    fecha: Date;
}

/** Reseña de la persona que la escribió («Mis reseñas»). */
export interface MyReview {
    id: number;
    empresa: NamedRef;
    local: NamedRef & { ciudad: string };
    /** Hay una versión publicada visible (puede ser anterior a la última). */
    publicada: boolean;
    ultimaVersion: MyReviewVersion;
}

/** Datos mínimos de una reseña propia para decidir si se puede editar. */
export interface OwnedReview {
    id: number;
    lastStatus: ReviewStatus;
}
