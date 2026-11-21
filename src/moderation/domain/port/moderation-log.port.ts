import { AutomaticSignals, HumanDecision, Verdict } from '../model/moderation';

/** Registro de decisiones (sección 9 de la política) y gasto del mes (sección 10). */
export abstract class ModerationLog {
    /** Guarda la decisión con la huella del texto (nunca el texto). */
    abstract record(verdict: Verdict, textHash: string, reviewId: number | null, versionId?: number | null): Promise<void>;
    /** Gasto en USD del mes calendario en curso. */
    abstract monthSpendUsd(): Promise<number>;
    /** Suma un costo al mes en curso. */
    abstract addSpend(costUsd: number): Promise<void>;
    /** Guarda una decisión de la revisión humana (origen «persona»). */
    abstract recordHuman(decision: HumanDecision, textHash: string, reviewId: number, versionId: number): Promise<void>;
    /** Última decisión automática (reglas o modelo) de cada versión. */
    abstract signalsFor(versionIds: number[]): Promise<AutomaticSignals[]>;
}
