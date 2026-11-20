import { AnthropicClassifier, costUsd } from './anthropic-classifier';

describe('AnthropicClassifier', () => {
    it('sin clave no llama a la API y devuelve la falla «sin_clave»', async () => {
        const classifier = new AnthropicClassifier({ apiKey: undefined, model: 'claude-haiku-5-5', timeoutMs: 10000 });
        await expect(classifier.classify('texto')).resolves.toEqual({ ok: false, failure: 'sin_clave', costUsd: 0 });
    });

    it('calcula el costo con los precios del modelo (USD por millón de tokens)', () => {
        const usage = { input_tokens: 1000, output_tokens: 200, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } as never;
        expect(costUsd('claude-haiku-5-5', usage)).toBeCloseTo((1000 * 0.1 + 200 * 0.5) / 1e6, 10);
        expect(costUsd('claude-opus-5-5', usage)).toBeCloseTo((1000 * 4 + 200 * 20) / 1e6, 10);
    });

    it('un modelo sin precio conocido se cuenta con el más caro, para no pasarse del tope', () => {
        const usage = { input_tokens: 1000, output_tokens: 0, cache_creation_input_tokens: null, cache_read_input_tokens: null } as never;
        expect(costUsd('modelo-desconocido', usage)).toBeCloseTo(0.004, 10);
    });
});
