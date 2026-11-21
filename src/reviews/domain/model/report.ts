import { CATEGORIES, ModerationCategory } from 'src/moderation/domain/model/moderation';
import { NamedRef } from './review-views';

// Reportes de reseñas publicadas (política de moderación, sección 8).

/** Una categoría de la política u «Otro» con comentario. */
export type ReportCategory = ModerationCategory | 'OTRO';
export const REPORT_CATEGORIES: readonly ReportCategory[] = [...CATEGORIES, 'OTRO'];

export enum ReportStatus {
    Pending = 'pendiente',
    Kept = 'mantenida',
    Retired = 'retirada',
}

export const COMMENT_MAX = 500;

/** Reseña con reportes pendientes, para la administración. Sin el autor ni quién reportó. */
export interface ReportedReview {
    idResena: number;
    empresa: NamedRef;
    local: NamedRef & { ciudad: string };
    /** Sigue publicada (los reportes no la ocultan). */
    publicada: boolean;
    calificacion: number | null;
    loBueno: string | null;
    aMejorar: string | null;
    cantidad: number;
    primerReporte: Date;
    reportes: { categoria: ReportCategory; comentario: string | null; fecha: Date }[];
}

/** Valida un reporte; devuelve el problema o `null`. */
export function reportProblem(category: ReportCategory, comment: string | null): string | null {
    if (!REPORT_CATEGORIES.includes(category)) return 'Elegí una categoría de la lista';
    if (category === 'OTRO' && !comment) return 'Contanos por qué la reportás';
    if (comment && comment.length > COMMENT_MAX) return `El comentario puede tener hasta ${COMMENT_MAX} caracteres`;
    return null;
}
