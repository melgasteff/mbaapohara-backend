import { Verdict } from '../model/moderation';

/** Registro de decisiones (sección 9 de la política) y gasto del mes (sección 10). */
export abstract class ModerationLog {
    /** Guarda la decisión con la huella del texto (nunca el texto). */
    abstract record(verdict: Verdict, textHash: string, reviewId: number | null, versionId?: number | null): Promise<void>;
    /** Gasto en USD del mes calendario en curso. */
    abstract monthSpendUsd(): Promise<number>;
    /** Suma un costo al mes en curso. */
    abstract addSpend(costUsd: number): Promise<void>;
}
