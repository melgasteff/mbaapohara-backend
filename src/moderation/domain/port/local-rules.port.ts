import { RuleSignal } from '../model/moderation';

/** Reglas locales sin costo (paso 1 de la política): datos de contacto, lista de insultos y texto repetido. */
export abstract class LocalRules {
    abstract check(text: string): RuleSignal[];
}
