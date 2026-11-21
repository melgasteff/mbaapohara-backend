// Modelo de dominio de la reseña (R2 a R7, sección 7 del PLAN). Sin dependencias de Nest ni de TypeORM.
// Los valores de los enums son los de la base (migración 1795300000000-reviews).

/** Estado de moderación de una versión (política de moderación, sección 7). */
export enum ReviewStatus {
    InReview = 'en_revision',
    Published = 'publicada',
    Rejected = 'rechazada',
}

/** Situación de la relación laboral (R5). */
export enum WorkSituation {
    Current = 'actual',
    Former = 'anterior',
}

/** Respuesta de un criterio (R2). */
export enum CriterionAnswer {
    Yes = 'si',
    Partly = 'en_parte',
    No = 'no',
    DontKnow = 'no_sabe',
}

export const TEXT_MIN = 50;
export const TEXT_MAX = 1000;
export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const FIRST_YEAR = 1950;

/** Cargo de la reseña: uno de la lista o uno que propone la persona. */
export type ReviewJob = { id: number } | { proposed: string };

/** Lo que escribe la persona en cada envío o edición. */
export interface ReviewInput {
    job: ReviewJob;
    situation: WorkSituation;
    /** Último año en la empresa; se ignora si la persona trabaja ahí actualmente. */
    lastYear: number | null;
    contractTypeId: number;
    workModeId: number;
    rating: number;
    loBueno: string;
    aMejorar: string;
    /** Respuesta por código de criterio: «CP01» → `si`. */
    answers: Record<string, CriterionAnswer>;
}

/** Contenido validado, listo para guardar como versión. */
export interface ReviewContent extends Omit<ReviewInput, 'answers'> {
    /** Respuesta por id de ítem. */
    answers: { itemId: number; answer: CriterionAnswer }[];
}

/** Criterio activo que la reseña tiene que responder. */
export interface ActiveCriterion {
    id: number;
    code: string;
}

/**
 * Valida y normaliza el contenido de una reseña. Devuelve los problemas encontrados (vacío si está bien):
 * la base hace cumplir las mismas reglas con CHECK, pero acá se explican a la persona.
 */
export function validateReview(input: ReviewInput, criteria: ActiveCriterion[], currentYear: number):
    { content: ReviewContent; problems: [] } | { content: null; problems: string[] } {
    const problems: string[] = [];
    const loBueno = input.loBueno.trim();
    const aMejorar = input.aMejorar.trim();
    for (const [label, text] of [['Lo bueno', loBueno], ['A mejorar', aMejorar]] as const) {
        if (text.length < TEXT_MIN || text.length > TEXT_MAX) {
            problems.push(`«${label}» tiene que tener entre ${TEXT_MIN} y ${TEXT_MAX} caracteres`);
        }
    }
    if (!Number.isInteger(input.rating) || input.rating < RATING_MIN || input.rating > RATING_MAX) {
        problems.push(`La calificación general va de ${RATING_MIN} a ${RATING_MAX}`);
    }

    // Solo el año, y solo si ya no trabaja ahí (anonimato, R5).
    let lastYear: number | null = null;
    if (input.situation === WorkSituation.Former) {
        if (input.lastYear === null || !Number.isInteger(input.lastYear)) {
            problems.push('Indicá el último año en que trabajaste ahí');
        } else if (input.lastYear < FIRST_YEAR || input.lastYear > currentYear) {
            problems.push(`El último año tiene que estar entre ${FIRST_YEAR} y ${currentYear}`);
        } else {
            lastYear = input.lastYear;
        }
    }

    if ('proposed' in input.job) {
        const proposed = input.job.proposed.trim().replace(/\s+/g, ' ');
        if (proposed.length < 2 || proposed.length > 80) problems.push('El cargo propuesto tiene que tener entre 2 y 80 caracteres');
        input = { ...input, job: { proposed } };
    }

    // Todos los criterios activos, y solo esos (R7).
    const byCode = new Map(criteria.map(c => [c.code, c.id]));
    const missing = criteria.filter(c => !(c.code in input.answers)).map(c => c.code);
    const unknown = Object.keys(input.answers).filter(code => !byCode.has(code));
    if (missing.length) problems.push(`Faltan respuestas: ${missing.join(', ')}`);
    if (unknown.length) problems.push(`Criterios que no existen o ya no se usan: ${unknown.join(', ')}`);

    if (problems.length) return { content: null, problems };
    return {
        content: {
            ...input,
            loBueno,
            aMejorar,
            lastYear,
            answers: criteria.map(c => ({ itemId: c.id, answer: input.answers[c.code] })),
        },
        problems: [],
    };
}
