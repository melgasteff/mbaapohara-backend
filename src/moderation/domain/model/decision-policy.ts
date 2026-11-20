import { CATEGORIES, CategoryScores, ClassifierFailure, ModerationCategory, ModerationOutcome, RuleSignal } from './moderation';

// Tabla de decisión de la política de moderación (sección 5). Umbrales provisionales: se recalibran con la
// medición de la tarea 2.4.
export const REVIEW_THRESHOLD = 0.5;
export const REJECT_THRESHOLD = 0.85;

/** Mensajes para quien escribió la reseña (sección 7). */
export const REJECTION_MESSAGES: Record<ModerationCategory, string> = {
    DP: 'Tu reseña tiene datos de contacto (un teléfono, un correo, un documento o un enlace). Sacalos y volvé a enviarla.',
    TER: 'Tu reseña nombra o señala a una persona. Contá lo que pasó sin decir quién fue.',
    ACU: 'Tu reseña acusa de un delito a una persona. Podés contar el hecho sobre la empresa sin identificar a nadie.',
    INS: 'Tu reseña tiene insultos o expresiones discriminatorias. Contá lo que pasó con otras palabras.',
    SPAM: 'Tu reseña parece publicidad o un texto repetido. Contá tu experiencia de trabajo.',
    TEMA: 'Tu reseña no habla de tu experiencia de trabajo en la empresa. Contá cómo fue trabajar ahí.',
};
export const REVIEW_MESSAGE = 'Tu reseña está en revisión. Te avisamos en 48 horas.';
export const PUBLISHED_MESSAGE = 'Tu reseña ya está publicada.';

export interface DecisionInput {
    rules: RuleSignal[];
    /** `null` si el modelo no se consultó o falló. */
    scores: CategoryScores | null;
    failure: ClassifierFailure | null;
}

export interface Decision {
    outcome: ModerationOutcome;
    category: ModerationCategory | null;
    message: string;
    origin: 'reglas' | 'modelo';
}

/** Categoría con la confianza más alta entre las que cumplen la condición. */
function top(scores: CategoryScores, accept: (category: ModerationCategory, score: number) => boolean): ModerationCategory | null {
    let best: ModerationCategory | null = null;
    for (const category of CATEGORIES) {
        if (accept(category, scores[category]) && (best === null || scores[category] > scores[best])) best = category;
    }
    return best;
}

/**
 * Aplica la tabla de decisión en orden; gana la primera fila que se cumple.
 * 1. Regla DP → rechazada. 2. ACU ≥ 0,5 → revisión. 3. Otra categoría ≥ 0,85 → rechazada.
 * 4. Alguna entre 0,5 y 0,85, lista de insultos o texto repetido → revisión. 5. Sin modelo → revisión. 6. Publicada.
 */
export function decide(input: DecisionInput): Decision {
    const { rules, scores, failure } = input;

    if (rules.includes('datos_contacto')) {
        return { outcome: ModerationOutcome.Rejected, category: ModerationCategory.DP, message: REJECTION_MESSAGES.DP, origin: 'reglas' };
    }

    if (!scores || failure) {
        const ruleCategory = rules.includes('lista_insultos') ? ModerationCategory.INS : rules.includes('texto_repetido') ? ModerationCategory.SPAM : null;
        return { outcome: ModerationOutcome.InReview, category: ruleCategory, message: REVIEW_MESSAGE, origin: ruleCategory ? 'reglas' : 'modelo' };
    }

    if (scores.ACU >= REVIEW_THRESHOLD) {
        return { outcome: ModerationOutcome.InReview, category: ModerationCategory.ACU, message: REVIEW_MESSAGE, origin: 'modelo' };
    }

    const rejected = top(scores, (category, score) => category !== ModerationCategory.ACU && score >= REJECT_THRESHOLD);
    if (rejected) {
        return { outcome: ModerationOutcome.Rejected, category: rejected, message: REJECTION_MESSAGES[rejected], origin: 'modelo' };
    }

    const doubtful = top(scores, (_category, score) => score >= REVIEW_THRESHOLD);
    if (doubtful) {
        return { outcome: ModerationOutcome.InReview, category: doubtful, message: REVIEW_MESSAGE, origin: 'modelo' };
    }
    if (rules.includes('lista_insultos')) {
        return { outcome: ModerationOutcome.InReview, category: ModerationCategory.INS, message: REVIEW_MESSAGE, origin: 'reglas' };
    }
    if (rules.includes('texto_repetido')) {
        return { outcome: ModerationOutcome.InReview, category: ModerationCategory.SPAM, message: REVIEW_MESSAGE, origin: 'reglas' };
    }

    return { outcome: ModerationOutcome.Published, category: null, message: PUBLISHED_MESSAGE, origin: 'modelo' };
}
