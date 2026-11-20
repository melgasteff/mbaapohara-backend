/** Configuración de la moderación que también se muestra al administrador (nunca la clave). */
export interface ModerationSettings {
    model: string;
    monthlyBudgetUsd: number;
    hasApiKey: boolean;
}

export const MODERATION_SETTINGS = Symbol('MODERATION_SETTINGS');
