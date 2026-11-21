import { AutomaticSignals, HumanDecision, ReviewText, Verdict } from '../model/moderation';

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
    /** Registra la decisión de la revisión humana, con la huella del texto que se revisó (sección 9). */
    abstract recordHumanDecision(text: ReviewText, decision: HumanDecision, context: Required<ModerationContext>): Promise<void>;
    /** Señales de la última moderación automática de cada versión (las que no tienen registro no aparecen). */
    abstract signalsFor(versionIds: number[]): Promise<AutomaticSignals[]>;
}
