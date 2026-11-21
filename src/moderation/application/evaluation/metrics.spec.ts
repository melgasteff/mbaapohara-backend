import { CategoryScores, ModerationCategory } from '../../domain/model/moderation';
import {
    agreement, categoryMetrics, cohenKappa, csvRecords, detected, evaluate, macroF1, measure, parseCsv, Prediction,
    Reference, referenceFromIntention, referenceFromLabels, sweep, toCsv,
} from './metrics';

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };
const set = (...categories: ModerationCategory[]) => new Set<ModerationCategory>(categories);
const scored = (id: string, scores: Partial<CategoryScores>): Prediction => ({ id, rules: [], scores: { ...zero, ...scores }, failure: null });

describe('CSV', () => {
    it('lee comillas, comillas escapadas, comas y saltos de línea dentro de un campo', () => {
        const text = 'id,texto\nM1,"Hola, ""jefe""\nsegunda línea"\r\nM2,simple\n';
        expect(parseCsv(text)).toEqual([['id', 'texto'], ['M1', 'Hola, "jefe"\nsegunda línea'], ['M2', 'simple']]);
        expect(csvRecords(text)[0]).toEqual({ id: 'M1', texto: 'Hola, "jefe"\nsegunda línea' });
    });

    it('escribe lo que lee', () => {
        const csv = toCsv(['id', 'texto'], [['M1', 'con, coma y "comillas"'], ['M2', 3]]);
        expect(csvRecords(csv)).toEqual([{ id: 'M1', texto: 'con, coma y "comillas"' }, { id: 'M2', texto: '3' }]);
    });
});

describe('Referencia', () => {
    it('lee las etiquetas binarias; NINGUNA es un conjunto vacío', () => {
        const ref = referenceFromLabels(csvRecords('id,DP,TER,ACU,INS,SPAM,TEMA,NINGUNA,notas\nM1,1,0,0,0,1,0,0,\nM2,0,0,0,0,0,0,1,ok\n'));
        expect([...ref.get('M1')!]).toEqual(['DP', 'SPAM']);
        expect(ref.get('M2')!.size).toBe(0);
    });

    it('rechaza un texto sin etiquetar o con NINGUNA y categorías a la vez', () => {
        expect(() => referenceFromLabels(csvRecords('id,DP,TER,ACU,INS,SPAM,TEMA,NINGUNA\nM1,,,,,,,\n'))).toThrow('M1 no tiene ninguna etiqueta');
        expect(() => referenceFromLabels(csvRecords('id,DP,TER,ACU,INS,SPAM,TEMA,NINGUNA\nM1,1,0,0,0,0,0,1\n'))).toThrow('NINGUNA y además');
    });

    it('lee la intención de autoría con varias categorías', () => {
        const ref = referenceFromIntention(csvRecords('id,intencion,dificultad\nM1,SPAM|DP,normal\nM2,NINGUNA,normal\n'));
        expect([...ref.get('M1')!].sort()).toEqual(['DP', 'SPAM']);
        expect(ref.get('M2')!.size).toBe(0);
    });
});

describe('Detección', () => {
    it('cuenta las reglas y las confianzas desde el umbral de revisión', () => {
        const p: Prediction = { id: 'M1', rules: ['datos_contacto', 'lista_insultos'], scores: { ...zero, TER: 0.5, TEMA: 0.49 }, failure: null };
        expect([...detected(p)].sort()).toEqual(['DP', 'INS', 'TER']);
        expect([...detected(p, { review: 0.4, reject: 0.9 })].sort()).toEqual(['DP', 'INS', 'TEMA', 'TER']);
    });

    it('sin el modelo solo cuentan las reglas', () => {
        expect([...detected({ id: 'M1', rules: ['texto_repetido'], scores: null, failure: null })]).toEqual(['SPAM']);
    });
});

describe('Métricas', () => {
    it('calcula exactitud, precisión, exhaustividad y F1', () => {
        const m = categoryMetrics(ModerationCategory.TER, { tp: 8, fp: 2, fn: 2, tn: 88 });
        expect(m).toMatchObject({ support: 10, accuracy: 0.96, precision: 0.8, recall: 0.8 });
        expect(m.f1).toBeCloseTo(0.8);
    });

    it('deja sin valor lo que no se puede calcular; no detectar nunca una categoría presente es F1 = 0', () => {
        expect(categoryMetrics(ModerationCategory.ACU, { tp: 0, fp: 0, fn: 3, tn: 7 })).toMatchObject({ precision: null, recall: 0, f1: 0 });
        expect(categoryMetrics(ModerationCategory.ACU, { tp: 0, fp: 2, fn: 0, tn: 8 })).toMatchObject({ precision: 0, recall: null, f1: null });
    });

    it('arma la matriz por categoría contra la referencia', () => {
        const ref: Reference = new Map([['A', set(ModerationCategory.TER)], ['B', set()], ['C', set(ModerationCategory.TER)]]);
        const preds = [scored('A', { TER: 0.9 }), scored('B', { TER: 0.6 }), scored('C', { TER: 0.1 })];
        const ter = evaluate(ref, preds).find(m => m.category === ModerationCategory.TER)!;
        expect(ter).toMatchObject({ tp: 1, fp: 1, fn: 1, tn: 0, precision: 0.5, recall: 0.5 });
    });

    it('el F1 macro promedia las categorías presentes en la referencia', () => {
        expect(macroF1([
            categoryMetrics(ModerationCategory.DP, { tp: 1, fp: 0, fn: 0, tn: 1 }),
            categoryMetrics(ModerationCategory.TER, { tp: 0, fp: 0, fn: 0, tn: 2 }),
            categoryMetrics(ModerationCategory.ACU, { tp: 1, fp: 1, fn: 1, tn: 1 }),
        ])).toBeCloseTo(0.75);
    });

    it('falla si falta la predicción de algún texto', () => {
        const ref: Reference = new Map([['A', set()], ['B', set()]]);
        expect(() => evaluate(ref, [scored('A', {})])).toThrow('Faltan predicciones para 1 textos');
    });
});

describe('Kappa de Cohen', () => {
    it('coincide con el cálculo a mano', () => {
        // acuerdo observado 0,75; esperado 0,5·0,25 + 0,5·0,75 = 0,5 → (0,75 − 0,5) / 0,5 = 0,5
        expect(cohenKappa([true, true, false, false], [true, false, false, false])).toBeCloseTo(0.5);
        expect(cohenKappa([false, false], [false, false])).toBe(1);
    });

    it('compara dos etiquetados por categoría y para NINGUNA', () => {
        const a: Reference = new Map([['A', set(ModerationCategory.DP)], ['B', set()]]);
        const b: Reference = new Map([['A', set(ModerationCategory.DP)], ['B', set(ModerationCategory.TEMA)]]);
        const result = agreement(a, b);
        expect(result.find(r => r.label === 'DP')).toEqual({ label: 'DP', kappa: 1, agree: 1 });
        expect(result.find(r => r.label === 'NINGUNA')!.agree).toBe(0.5);
    });
});

describe('Indicadores de la política', () => {
    const ref: Reference = new Map([
        ['A', set(ModerationCategory.ACU, ModerationCategory.TER)],
        ['B', set()],
        ['C', set()],
        ['D', set(ModerationCategory.DP)],
    ]);
    const preds: Prediction[] = [
        scored('A', { ACU: 0.9, TER: 0.95 }), // ACU va a revisión, aunque TER llegue al rechazo
        scored('B', { TEMA: 0.9 }),           // crítica legítima rechazada por error
        scored('C', {}),                      // publicada
        { id: 'D', rules: ['datos_contacto'], scores: null, failure: null },
    ];

    it('calcula los rechazos de «Ninguna» y la tasa de revisión con la tabla de decisión', () => {
        const m = measure(ref, preds);
        expect(m.noneRejected).toBe(0.5);
        expect(m.reviewRate).toBe(0.25);
        expect(m.indicators.find(i => i.name === 'Exhaustividad en ACU')).toMatchObject({ value: 1, passes: true });
        expect(m.indicators.find(i => i.name.startsWith('Textos «Ninguna»'))).toMatchObject({ value: 0.5, passes: false });
    });

    it('sin el modelo no informa las tasas de resultado', () => {
        const rulesOnly = preds.map(p => ({ ...p, scores: null }));
        const m = measure(ref, rulesOnly);
        expect(m.noneRejected).toBeNull();
        expect(m.reviewRate).toBeNull();
        expect(m.indicators.find(i => i.name === 'Reseñas derivadas a revisión humana')!.passes).toBeNull();
    });

    it('el barrido prueba solo pares con revisión menor que rechazo', () => {
        const runs = sweep(ref, preds, [0.5, 0.9], [0.85, 0.95]);
        expect(runs.map(r => [r.thresholds.review, r.thresholds.reject])).toEqual([[0.5, 0.85], [0.5, 0.95], [0.9, 0.95]]);
        // Con rechazo en 0,95 el TEMA de 0,9 ya no rechaza: va a revisión.
        expect(runs[1].noneRejected).toBe(0);
    });
});
