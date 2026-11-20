// Modelo de dominio de la moderación (docs/politica-moderacion.md). Sin dependencias de Nest ni de TypeORM.

/** Categorías de la política (sección 4). */
export enum ModerationCategory {
    DP = 'DP',
    TER = 'TER',
    ACU = 'ACU',
    INS = 'INS',
    SPAM = 'SPAM',
    TEMA = 'TEMA',
}

export const CATEGORIES: readonly ModerationCategory[] = Object.values(ModerationCategory);

/** Resultado de la moderación de un texto (sección 7). */
export enum ModerationOutcome {
    Published = 'publicada',
    InReview = 'en_revision',
    Rejected = 'rechazada',
}

/** Señales que encuentran las reglas locales (paso 1 de la sección 5). */
export type RuleSignal = 'datos_contacto' | 'lista_insultos' | 'texto_repetido';

/** Confianza de 0 a 1 por categoría, según el clasificador. */
export type CategoryScores = Record<ModerationCategory, number>;

/** Por qué no hubo clasificación del modelo; en todos los casos la reseña va a revisión humana. */
export type ClassifierFailure = 'sin_clave' | 'tope_de_gasto' | 'error' | 'rechazo_del_modelo' | 'respuesta_invalida';

/** Lo que devuelve el clasificador cuando responde bien. */
export interface Classification {
    scores: CategoryScores;
    provider: string;
    model: string;
    promptVersion: string;
    costUsd: number;
    /** Frase breve del modelo para quien modera (nunca se muestra a quien escribió). */
    reason: string;
}

/** Texto de una reseña: los dos campos se analizan juntos (R6). */
export interface ReviewText {
    loBueno: string;
    aMejorar: string;
}

/** Decisión final, con lo necesario para el registro y para explicársela a quien escribió. */
export interface Verdict {
    outcome: ModerationOutcome;
    /** Categoría que motivó el rechazo o la revisión; `null` si se publica o si el modelo falló sin categoría. */
    category: ModerationCategory | null;
    /** Mensaje para quien escribió la reseña (sección 7 de la política). */
    message: string;
    /** «reglas» si decidieron las reglas, «modelo» si decidió el clasificador. */
    origin: 'reglas' | 'modelo';
    rules: RuleSignal[];
    scores: CategoryScores | null;
    failure: ClassifierFailure | null;
    model: string | null;
    promptVersion: string | null;
    /** Motivo breve del modelo, para la cola de revisión humana. */
    modelReason: string | null;
    costUsd: number;
}
