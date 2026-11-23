import { decide, REJECTION_MESSAGES, REVIEW_MESSAGE } from './decision-policy';
import { CategoryScores, ModerationCategory as C, ModerationOutcome as O } from './moderation';

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };
const scores = (partial: Partial<CategoryScores>): CategoryScores => ({ ...zero, ...partial });

describe('Tabla de decisión de la política de moderación (sección 5)', () => {
    it('fila 1: la regla de datos de contacto rechaza, aunque el modelo no se haya consultado', () => {
        expect(decide({ rules: ['datos_contacto'], scores: null, failure: null })).toMatchObject({
            outcome: O.Rejected, category: C.DP, origin: 'reglas', message: REJECTION_MESSAGES.DP,
        });
    });

    it('fila 2: una acusación con 0,15 o más va siempre a revisión, aunque supere 0,85', () => {
        expect(decide({ rules: [], scores: scores({ ACU: 0.99 }), failure: null })).toMatchObject({ outcome: O.InReview, category: C.ACU });
        expect(decide({ rules: [], scores: scores({ ACU: 0.15, INS: 0.95 }), failure: null })).toMatchObject({ outcome: O.InReview, category: C.ACU });
        expect(decide({ rules: [], scores: scores({ ACU: 0.14 }), failure: null }).outcome).toBe(O.Published);
    });

    it('fila 2: el umbral de ACU es propio: no cambia el de las demás categorías', () => {
        expect(decide({ rules: [], scores: scores({ TER: 0.4, INS: 0.4 }), failure: null }).outcome).toBe(O.Published);
        expect(decide({ rules: [], scores: scores({ ACU: 0.3 }), failure: null }, { review: 0.5, reject: 0.85, acu: 0.5 }).outcome).toBe(O.Published);
    });

    it('fila 3: otra categoría con 0,85 o más rechaza con su mensaje, eligiendo la de mayor confianza', () => {
        expect(decide({ rules: [], scores: scores({ TER: 0.86, INS: 0.9 }), failure: null })).toMatchObject({
            outcome: O.Rejected, category: C.INS, message: REJECTION_MESSAGES.INS,
        });
    });

    it('fila 4: entre 0,5 y 0,85 va a revisión', () => {
        expect(decide({ rules: [], scores: scores({ TER: 0.6 }), failure: null })).toMatchObject({ outcome: O.InReview, category: C.TER, message: REVIEW_MESSAGE });
    });

    it('fila 4: la lista de insultos o el texto repetido mandan a revisión aunque el modelo diga que no hay nada', () => {
        expect(decide({ rules: ['lista_insultos'], scores: zero, failure: null })).toMatchObject({ outcome: O.InReview, category: C.INS, origin: 'reglas' });
        expect(decide({ rules: ['texto_repetido'], scores: zero, failure: null })).toMatchObject({ outcome: O.InReview, category: C.SPAM });
    });

    it('fila 5: sin modelo (sin clave, error, tope o rechazo) va a revisión', () => {
        for (const failure of ['sin_clave', 'error', 'tope_de_gasto', 'rechazo_del_modelo', 'respuesta_invalida'] as const) {
            expect(decide({ rules: [], scores: null, failure }).outcome).toBe(O.InReview);
        }
    });

    it('fila 6: todo por debajo de 0,5 se publica (los umbrales son inclusivos en 0,5 y 0,85)', () => {
        expect(decide({ rules: [], scores: scores({ TER: 0.49, INS: 0.3 }), failure: null }).outcome).toBe(O.Published);
        expect(decide({ rules: [], scores: scores({ SPAM: 0.85 }), failure: null }).outcome).toBe(O.Rejected);
    });
});
