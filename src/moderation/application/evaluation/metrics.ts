// Medición del clasificador de moderación (tarea 2.4, política sección 11). Funciones puras: leen tablas ya parseadas,
// no llaman al modelo ni a la base. Las usan los comandos de src/moderation/infrastructure/cli/.
import { decide, POLICY_THRESHOLDS, Thresholds } from '../../domain/model/decision-policy';
import { CATEGORIES, CategoryScores, ClassifierFailure, ModerationCategory, ModerationOutcome, RuleSignal } from '../../domain/model/moderation';

// ---------- CSV

/** Lee un CSV (RFC 4180): comas, comillas dobles, comillas escapadas ("") y saltos de línea dentro de comillas. */
export function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let quoted = false;
    const source = text.replace(/^﻿/, '');
    for (let i = 0; i < source.length; i++) {
        const char = source[i];
        if (quoted) {
            if (char === '"' && source[i + 1] === '"') { field += '"'; i++; }
            else if (char === '"') quoted = false;
            else field += char;
        } else if (char === '"') quoted = true;
        else if (char === ',') { row.push(field); field = ''; }
        else if (char === '\n' || char === '\r') {
            if (char === '\r' && source[i + 1] === '\n') i++;
            row.push(field); rows.push(row); row = []; field = '';
        } else field += char;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

/** Filas de un CSV con encabezado, como objetos por nombre de columna. */
export function csvRecords(text: string): Record<string, string>[] {
    const [header, ...rows] = parseCsv(text);
    if (!header) return [];
    return rows.map(cells => Object.fromEntries(header.map((name, i) => [name.trim(), (cells[i] ?? '').trim()])));
}

/** Escribe un CSV; pone comillas solo donde hace falta. */
export function toCsv(header: string[], rows: (string | number)[][]): string {
    const cell = (value: string | number) => {
        const text = String(value);
        return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    return [header, ...rows].map(row => row.map(cell).join(',')).join('\n') + '\n';
}

// ---------- referencia (lo que el texto contiene de verdad, según quien etiqueta)

/** Categorías que tiene cada texto. Un conjunto vacío es «Ninguna». */
export type Reference = Map<string, Set<ModerationCategory>>;

/** Etiquetas de una persona o la final: `1` en cada categoría presente (`etiquetas-*.csv`). */
export function referenceFromLabels(records: Record<string, string>[]): Reference {
    const reference: Reference = new Map();
    for (const record of records) {
        const marked = CATEGORIES.filter(category => record[category] === '1');
        const none = record.NINGUNA === '1';
        const empty = !none && marked.length === 0 && CATEGORIES.every(category => record[category] === '');
        if (empty) throw new Error(`El texto ${record.id} no tiene ninguna etiqueta: marcá sus categorías o NINGUNA`);
        if (none && marked.length) throw new Error(`El texto ${record.id} tiene NINGUNA y además categorías`);
        reference.set(record.id, new Set(marked));
    }
    return reference;
}

/** Intención con la que se escribió cada texto (`intencion-autora.csv`, «SPAM|DP»). Solo para la medición provisional. */
export function referenceFromIntention(records: Record<string, string>[]): Reference {
    const valid = new Set<string>(CATEGORIES);
    return new Map(records.map(record => {
        const parts = record.intencion.split('|').map(part => part.trim()).filter(part => part && part !== 'NINGUNA');
        for (const part of parts) if (!valid.has(part)) throw new Error(`Categoría desconocida «${part}» en ${record.id}`);
        return [record.id, new Set(parts as ModerationCategory[])];
    }));
}

// ---------- predicción (lo que hizo el sistema con cada texto)

export interface Prediction {
    id: string;
    rules: RuleSignal[];
    /** `null` si no se consultó el modelo o falló. */
    scores: CategoryScores | null;
    failure: ClassifierFailure | null;
}

/** Categoría que señala cada regla local. */
const RULE_CATEGORY: Record<RuleSignal, ModerationCategory> = {
    datos_contacto: ModerationCategory.DP,
    lista_insultos: ModerationCategory.INS,
    texto_repetido: ModerationCategory.SPAM,
};

/**
 * Categorías que el sistema detecta en un texto: las que marca una regla y las que el modelo puntúa con el umbral de
 * revisión o más (desde ahí el sistema actúa: revisa o rechaza).
 */
export function detected(prediction: Prediction, thresholds: Thresholds = POLICY_THRESHOLDS): Set<ModerationCategory> {
    const found = new Set(prediction.rules.map(rule => RULE_CATEGORY[rule]));
    if (prediction.scores) {
        for (const category of CATEGORIES) if (prediction.scores[category] >= thresholds.review) found.add(category);
    }
    return found;
}

/** Resultado de la tabla de decisión para un texto, con los umbrales dados. */
export function outcomeOf(prediction: Prediction, thresholds: Thresholds = POLICY_THRESHOLDS): ModerationOutcome {
    return decide({ rules: prediction.rules, scores: prediction.scores, failure: prediction.failure }, thresholds).outcome;
}

// ---------- métricas

export interface Confusion { tp: number; fp: number; fn: number; tn: number }

export interface CategoryMetrics extends Confusion {
    category: ModerationCategory;
    /** Textos que la tienen según la referencia. */
    support: number;
    accuracy: number;
    /** `null` si el sistema no marcó ningún texto con esta categoría (no hay nada que medir). */
    precision: number | null;
    /** `null` si ningún texto la tiene en la referencia. */
    recall: number | null;
    /** `null` si ningún texto la tiene en la referencia; 0 si la tiene alguno y no se detectó ninguno. */
    f1: number | null;
}

const ratio = (num: number, den: number): number | null => (den === 0 ? null : num / den);

export function categoryMetrics(category: ModerationCategory, c: Confusion): CategoryMetrics {
    const precision = ratio(c.tp, c.tp + c.fp);
    const recall = ratio(c.tp, c.tp + c.fn);
    // Si la categoría está en la referencia y no se detectó nunca, el F1 es 0 (no se omite: bajaría el F1 macro de
    // mentira). Solo queda sin valor si ningún texto la tiene.
    const f1 = recall === null ? null : c.tp === 0 ? 0 : (2 * precision! * recall) / (precision! + recall);
    return { category, ...c, support: c.tp + c.fn, accuracy: (c.tp + c.tn) / (c.tp + c.fp + c.fn + c.tn), precision, recall, f1 };
}

/** Ids de la referencia que tienen predicción. Falla si falta alguno: una medición parcial no sirve. */
function paired(reference: Reference, predictions: Prediction[]): Prediction[] {
    const byId = new Map(predictions.map(p => [p.id, p]));
    const missing = [...reference.keys()].filter(id => !byId.has(id));
    if (missing.length) throw new Error(`Faltan predicciones para ${missing.length} textos (por ejemplo ${missing.slice(0, 3).join(', ')})`);
    return [...reference.keys()].map(id => byId.get(id)!);
}

/** Matriz de confusión y métricas por categoría (una contra el resto). */
export function evaluate(reference: Reference, predictions: Prediction[], thresholds: Thresholds = POLICY_THRESHOLDS): CategoryMetrics[] {
    const rows = paired(reference, predictions).map(p => ({ truth: reference.get(p.id)!, found: detected(p, thresholds) }));
    return CATEGORIES.map(category => {
        const c: Confusion = { tp: 0, fp: 0, fn: 0, tn: 0 };
        for (const { truth, found } of rows) {
            const t = truth.has(category);
            const f = found.has(category);
            if (t && f) c.tp++; else if (!t && f) c.fp++; else if (t && !f) c.fn++; else c.tn++;
        }
        return categoryMetrics(category, c);
    });
}

/** F1 macro: promedio del F1 de las categorías presentes en la referencia. */
export function macroF1(metrics: CategoryMetrics[]): number | null {
    const values = metrics.map(m => m.f1).filter((v): v is number => v !== null);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

/** Kappa de Cohen entre dos etiquetados binarios de los mismos textos. */
export function cohenKappa(a: boolean[], b: boolean[]): number {
    if (a.length !== b.length || a.length === 0) throw new Error('Los dos etiquetados deben tener los mismos textos');
    const n = a.length;
    const agree = a.filter((value, i) => value === b[i]).length / n;
    const pa = a.filter(Boolean).length / n;
    const pb = b.filter(Boolean).length / n;
    const expected = pa * pb + (1 - pa) * (1 - pb);
    return expected === 1 ? 1 : (agree - expected) / (1 - expected);
}

/** Acuerdo entre dos personas, por categoría (y para NINGUNA). */
export function agreement(first: Reference, second: Reference): { label: string; kappa: number; agree: number }[] {
    const ids = [...first.keys()];
    const missing = ids.filter(id => !second.has(id));
    if (missing.length || second.size !== first.size) throw new Error('Los dos archivos de etiquetas deben tener los mismos textos');
    const labels: (ModerationCategory | 'NINGUNA')[] = [...CATEGORIES, 'NINGUNA'];
    return labels.map(label => {
        const has = (ref: Reference, id: string) => (label === 'NINGUNA' ? ref.get(id)!.size === 0 : ref.get(id)!.has(label));
        const a = ids.map(id => has(first, id));
        const b = ids.map(id => has(second, id));
        return { label, kappa: cohenKappa(a, b), agree: a.filter((v, i) => v === b[i]).length / ids.length };
    });
}

// ---------- indicadores de la política (sección 11)

export interface Indicator {
    name: string;
    value: number | null;
    /** Mínimo o máximo aceptable, fijado antes de medir. */
    limit: number;
    kind: 'min' | 'max';
    /** `null` si no se puede calcular (por ejemplo, sin el modelo). */
    passes: boolean | null;
}

export interface Measurement {
    thresholds: Thresholds;
    metrics: CategoryMetrics[];
    macroF1: number | null;
    /** Textos sin ninguna categoría en la referencia que el sistema rechaza. */
    noneRejected: number | null;
    /** Textos que el sistema manda a revisión humana. */
    reviewRate: number | null;
    indicators: Indicator[];
}

const check = (name: string, value: number | null, limit: number, kind: 'min' | 'max'): Indicator =>
    ({ name, value, limit, kind, passes: value === null ? null : kind === 'min' ? value >= limit : value <= limit });

/**
 * Mide el sistema contra la referencia. Las tasas de resultado (rechazo y revisión) solo tienen sentido con el modelo:
 * sin él, toda reseña sin datos de contacto va a revisión. Por eso son `null` si ningún texto tiene confianzas.
 */
export function measure(reference: Reference, predictions: Prediction[], thresholds: Thresholds = POLICY_THRESHOLDS): Measurement {
    const metrics = evaluate(reference, predictions, thresholds);
    const rows = paired(reference, predictions);
    const withModel = rows.some(p => p.scores !== null);
    const none = rows.filter(p => reference.get(p.id)!.size === 0);
    const noneRejected = withModel ? ratio(none.filter(p => outcomeOf(p, thresholds) === ModerationOutcome.Rejected).length, none.length) : null;
    const reviewRate = withModel ? rows.filter(p => outcomeOf(p, thresholds) === ModerationOutcome.InReview).length / rows.length : null;
    const recall = (category: ModerationCategory) => metrics.find(m => m.category === category)!.recall;
    const macro = macroF1(metrics);
    return {
        thresholds, metrics, macroF1: macro, noneRejected, reviewRate,
        indicators: [
            check('Exhaustividad en DP', recall(ModerationCategory.DP), 0.95, 'min'),
            check('Exhaustividad en TER', recall(ModerationCategory.TER), 0.8, 'min'),
            check('Exhaustividad en ACU', recall(ModerationCategory.ACU), 0.8, 'min'),
            check('F1 macro en las seis categorías', macro, 0.7, 'min'),
            check('Textos «Ninguna» rechazados por error', noneRejected, 0.1, 'max'),
            check('Reseñas derivadas a revisión humana', reviewRate, 0.3, 'max'),
        ],
    };
}

/** Recalcula la medición con cada par de umbrales (revisión < rechazo), para recalibrar (política, sección 12). */
export function sweep(reference: Reference, predictions: Prediction[], review: number[], reject: number[]): Measurement[] {
    return review.flatMap(r => reject.filter(j => j > r).map(j => measure(reference, predictions, { review: r, reject: j })));
}
