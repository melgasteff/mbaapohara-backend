import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { Logger } from '@nestjs/common';
import { z } from 'zod';
import { CATEGORIES, CategoryScores } from '../../domain/model/moderation';
import { ClassifierResult, TextClassifier } from '../../domain/port/text-classifier.port';
import { PROMPT_VERSION, SYSTEM_PROMPT } from './classifier-prompt';

/** Respuesta estructurada del modelo: una probabilidad por categoría y un motivo breve. */
const ClassificationSchema = z.object({
    DP: z.number(),
    TER: z.number(),
    ACU: z.number(),
    INS: z.number(),
    SPAM: z.number(),
    TEMA: z.number(),
    motivo: z.string(),
});

/** Precio en USD por millón de tokens (entrada, salida). Si el modelo no figura, se usa el más caro de la lista. */
const PRICES: Record<string, [number, number]> = {
    'claude-haiku-5-5': [0.1, 0.5],
    'claude-sonnet-5-5': [2, 10],
    'claude-opus-5-5': [4, 20],
};
const FALLBACK_PRICE: [number, number] = [4, 20];

export interface AnthropicClassifierOptions {
    apiKey: string | undefined;
    model: string;
    timeoutMs: number;
}

/** Costo de una respuesta según lo que informa la API (incluye los tokens de razonamiento, que se cobran como salida). */
export function costUsd(model: string, usage: Anthropic.Usage): number {
    const [input, output] = PRICES[model] ?? FALLBACK_PRICE;
    const inputTokens = usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) * 1.25 + (usage.cache_read_input_tokens ?? 0) * 0.1;
    return (inputTokens * input + usage.output_tokens * output) / 1_000_000;
}

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/**
 * Clasificador con un modelo de Claude vía API (D4). Solo envía el texto de la reseña. Sin clave, con un error, un
 * rechazo del modelo o una respuesta inválida devuelve una falla, y la política manda la reseña a revisión humana.
 */
export class AnthropicClassifier extends TextClassifier {
    private readonly logger = new Logger(AnthropicClassifier.name);
    private readonly client: Anthropic | null;

    constructor(private readonly options: AnthropicClassifierOptions) {
        super();
        // Un solo reintento y un tiempo máximo por intento (política, sección 5).
        this.client = options.apiKey ? new Anthropic({ apiKey: options.apiKey, timeout: options.timeoutMs, maxRetries: 1 }) : null;
    }

    async classify(text: string): Promise<ClassifierResult> {
        if (!this.client) return { ok: false, failure: 'sin_clave', costUsd: 0 };
        try {
            const response = await this.client.messages.parse({
                model: this.options.model,
                max_tokens: 2048,
                // Clasificar no necesita razonamiento largo: esfuerzo bajo, menos tokens y menos espera.
                output_config: { effort: 'low', format: zodOutputFormat(ClassificationSchema) },
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: `<resena>\n${text}\n</resena>` }],
            });
            const cost = costUsd(this.options.model, response.usage);
            if (response.stop_reason === 'refusal') return { ok: false, failure: 'rechazo_del_modelo', costUsd: cost };
            const parsed = response.parsed_output;
            if (!parsed || response.stop_reason === 'max_tokens') return { ok: false, failure: 'respuesta_invalida', costUsd: cost };

            const scores = Object.fromEntries(CATEGORIES.map((category) => [category, clamp(parsed[category])])) as CategoryScores;
            return { ok: true, classification: { scores, provider: 'anthropic', model: this.options.model, promptVersion: PROMPT_VERSION, costUsd: cost, reason: parsed.motivo.slice(0, 300) } };
        } catch (error) {
            // Nunca se registra el texto: solo el tipo de error.
            const kind = error instanceof Anthropic.APIError ? `${error.constructor.name} ${error.status ?? ''}`.trim() : error instanceof Error ? error.name : 'desconocido';
            this.logger.warn(`El clasificador no respondió (${kind}); la reseña va a revisión humana`);
            return { ok: false, failure: 'error', costUsd: 0 };
        }
    }
}
