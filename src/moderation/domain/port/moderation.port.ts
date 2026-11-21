import { ReviewText, Verdict } from '../model/moderation';

/** Reseña y versión que se moderan; se guardan en el registro. Sin ellas, la decisión queda sin reseña (pruebas). */
export interface ModerationContext {
    reviewId?: number;
    versionId?: number;
}

/**
 * Puerto público de la moderación. `reviews` (Fase 3) lo usa al publicar o editar una reseña: `moderation` solo
 * decide y registra; el estado de la reseña es de `reviews` (PLAN, sección 1.2).
 */
export abstract class ModerationPort {
    abstract evaluate(text: ReviewText, context?: ModerationContext): Promise<Verdict>;
}
