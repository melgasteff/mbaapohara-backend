// Mide el clasificador con las predicciones guardadas por `moderation:classify` (tarea 2.4, política sección 11).
// No llama al modelo: se puede repetir gratis, por ejemplo para probar otros umbrales.
//   npm run moderation:metrics                                  contra etiquetas-final.csv (la medición del OE5)
//   npm run moderation:metrics -- --referencia intencion        PROVISIONAL: contra la intención de autoría
//   npm run moderation:metrics -- --umbrales iniciales          con los umbrales fijados antes de medir (resultado principal)
//   npm run moderation:metrics -- --predicciones docs/moderacion/resultados/predicciones-reglas.csv
// Si están etiquetas-anotador-1.csv y etiquetas-anotador-2.csv, informa además el acuerdo (kappa de Cohen).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { CATEGORIES, RuleSignal } from '../../domain/model/moderation';
import { POLICY_THRESHOLDS, Thresholds } from '../../domain/model/decision-policy';
import {
    agreement, csvRecords, Indicator, INITIAL_THRESHOLDS, Measurement, measure, Prediction, Reference,
    referenceFromIntention, referenceFromLabels, sweep, sweepAcu,
} from '../../application/evaluation/metrics';

const DIR = join(process.cwd(), 'docs/moderacion');
const RESULTS = join(DIR, 'resultados');
const REVIEW_GRID = [0.3, 0.4, 0.5, 0.6, 0.7];
const REJECT_GRID = [0.7, 0.8, 0.85, 0.9, 0.95];
const ACU_GRID = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];

const option = (name: string) => {
    const index = process.argv.indexOf(name);
    return index >= 0 ? process.argv[index + 1] : undefined;
};
const read = (path: string) => csvRecords(readFileSync(path, 'utf8'));

/** Número con coma decimal, como en la política. */
const num = (value: number | null, digits = 2) => (value === null ? '—' : value.toFixed(digits).replace('.', ','));
const pct = (value: number | null) => (value === null ? '—' : `${(value * 100).toFixed(1).replace('.', ',')} %`);
const verdict = (i: Indicator) => (i.passes === null ? 'sin dato' : i.passes ? 'cumple' : '**no cumple**');

function latestPredictions(): string {
    const files = existsSync(RESULTS) ? readdirSync(RESULTS).filter(f => f.startsWith('predicciones-') && f.endsWith('.csv')) : [];
    if (!files.length) throw new Error('No hay predicciones: corré antes npm run moderation:classify');
    return join(RESULTS, files.sort((a, b) => statSync(join(RESULTS, b)).mtimeMs - statSync(join(RESULTS, a)).mtimeMs)[0]);
}

function predictionsFrom(path: string): Prediction[] {
    return read(path).map(r => ({
        id: r.id,
        rules: (r.reglas ? r.reglas.split('|') : []) as RuleSignal[],
        scores: r.DP === '' ? null : Object.fromEntries(CATEGORIES.map(c => [c, Number(r[c])])) as Prediction['scores'],
        failure: (r.fallo || null) as Prediction['failure'],
    }));
}

function indicatorsTable(m: Measurement): string {
    const value = (i: Indicator) => (i.name.startsWith('Textos') || i.name.startsWith('Reseñas') ? pct(i.value) : num(i.value));
    const limit = (i: Indicator) => `${i.kind === 'min' ? '≥' : '≤'} ${i.name.startsWith('Textos') || i.name.startsWith('Reseñas') ? pct(i.limit) : num(i.limit)}`;
    return ['| Indicador | Valor | Aceptable | Resultado |', '| --- | --- | --- | --- |',
        ...m.indicators.map(i => `| ${i.name} | ${value(i)} | ${limit(i)} | ${verdict(i)} |`)].join('\n');
}

function categoriesTable(m: Measurement): string {
    return ['| Categoría | Con la categoría | VP | FP | FN | VN | Exactitud | Precisión | Exhaustividad | F1 |',
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
        ...m.metrics.map(c => `| ${c.category} | ${c.support} | ${c.tp} | ${c.fp} | ${c.fn} | ${c.tn} | ${num(c.accuracy)} | ${num(c.precision)} | ${num(c.recall)} | ${num(c.f1)} |`),
        `| **F1 macro** | | | | | | | | | **${num(m.macroF1)}** |`].join('\n');
}

function sweepTable(runs: Measurement[], used: Thresholds): string {
    const value = (m: Measurement, name: string) => m.indicators.find(i => i.name === name)!.value;
    const all = (m: Measurement) => m.indicators.every(i => i.passes !== false);
    return ['| Revisión desde | Rechazo desde | Exh. DP | Exh. TER | Exh. ACU | F1 macro | «Ninguna» rechazados | A revisión | Cumple todo |',
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
        ...runs.map(m => {
            const current = m.thresholds.review === used.review && m.thresholds.reject === used.reject;
            const mark = current ? ' (actual)' : '';
            return `| ${num(m.thresholds.review)}${mark} | ${num(m.thresholds.reject)} | ${num(value(m, 'Exhaustividad en DP'))} | ${num(value(m, 'Exhaustividad en TER'))} | ${num(value(m, 'Exhaustividad en ACU'))} | ${num(m.macroF1)} | ${pct(m.noneRejected)} | ${pct(m.reviewRate)} | ${all(m) ? 'sí' : 'no'} |`;
        })].join('\n');
}

function acuTable(runs: Measurement[], used: Thresholds): string {
    const acu = (m: Measurement) => m.metrics.find(c => c.category === 'ACU')!;
    return ['| ACU desde | Exh. ACU | Precisión ACU | F1 macro | «Ninguna» rechazados | A revisión | Cumple todo |',
        '| --- | --- | --- | --- | --- | --- | --- |',
        ...runs.map(m => `| ${num(m.thresholds.acu)}${m.thresholds.acu === used.acu ? ' (actual)' : ''} | ${num(acu(m).recall)} | ${num(acu(m).precision)} | ${num(m.macroF1)} | ${pct(m.noneRejected)} | ${pct(m.reviewRate)} | ${m.indicators.every(i => i.passes !== false) ? 'sí' : 'no'} |`),
    ].join('\n');
}

function main() {
    const which = option('--umbrales') ?? 'politica';
    if (which !== 'politica' && which !== 'iniciales') throw new Error('--umbrales es «politica» o «iniciales»');
    const initial = which === 'iniciales';
    const thresholds = initial ? INITIAL_THRESHOLDS : POLICY_THRESHOLDS;
    const kind = option('--referencia') ?? 'final';
    if (kind !== 'final' && kind !== 'intencion') throw new Error('--referencia es «final» o «intencion»');
    const predictionsPath = option('--predicciones') ?? latestPredictions();
    const predictions = predictionsFrom(predictionsPath);
    const rows = read(predictionsPath);

    const finalPath = join(DIR, 'etiquetas-final.csv');
    if (kind === 'final' && !existsSync(finalPath)) {
        throw new Error('Falta docs/moderacion/etiquetas-final.csv (las etiquetas acordadas). Para una medición provisional: --referencia intencion');
    }
    const reference: Reference = kind === 'final' ? referenceFromLabels(read(finalPath)) : referenceFromIntention(read(join(DIR, 'intencion-autora.csv')));

    const withModel = predictions.some(p => p.scores !== null);
    const current = measure(reference, predictions, thresholds);
    // Con los umbrales iniciales ACU acompaña al de revisión; con los de la política queda fijo en el suyo.
    const runs = withModel ? sweep(reference, predictions, REVIEW_GRID, REJECT_GRID, initial ? undefined : thresholds.acu) : [];
    const acuRuns = withModel ? sweepAcu(reference, predictions, ACU_GRID, thresholds) : [];
    const spent = rows.reduce((sum, r) => sum + Number(r.costo_usd || 0), 0);
    const failures = predictions.filter(p => p.failure).length;
    const model = rows.find(r => r.modelo)?.modelo ?? '—';
    const prompt = rows.find(r => r.version_prompt)?.version_prompt || '—';

    const annotators = [1, 2].map(n => join(DIR, `etiquetas-anotador-${n}.csv`));
    const kappa = annotators.every(existsSync)
        ? agreement(referenceFromLabels(read(annotators[0])), referenceFromLabels(read(annotators[1])))
        : null;

    const date = new Date().toISOString().slice(0, 10);
    const name = `metricas-${date}-${kind}-${basename(predictionsPath, '.csv').replace(/^predicciones-/, '')}${initial ? '-umbrales-iniciales' : ''}`;
    const lines = [
        `# Medición de la moderación — ${date}`,
        '',
        kind === 'intencion'
            ? '> **PROVISIONAL: no es la medición del OE5.** La referencia es la intención con la que se escribió cada texto (`intencion-autora.csv`), no el etiquetado de dos personas. Sirve para probar el procedimiento y tener una primera idea; la guía de etiquetado explica por qué la intención no es la verdad.'
            : '> Referencia: `etiquetas-final.csv`, las etiquetas acordadas por dos personas (procedimiento de `docs/moderacion/README.md`).',
        '',
        `- Textos: ${predictions.length} (${[...reference.values()].filter(s => s.size === 0).length} sin ninguna categoría en la referencia)`,
        `- Predicciones: \`${basename(predictionsPath)}\` — ${withModel ? `reglas y modelo \`${model}\`, instrucción \`${prompt}\`` : '**solo reglas** (sin el modelo)'}`,
        initial
            ? `- Umbrales fijados antes de medir: revisión desde ${num(thresholds.review)} (también ACU), rechazo desde ${num(thresholds.reject)}`
            : `- Umbrales de la política: revisión desde ${num(thresholds.review)}, rechazo desde ${num(thresholds.reject)}, ACU desde ${num(thresholds.acu)} (siempre a revisión)`,
        ...(initial ? [] : ['- **El umbral de ACU se eligió con este mismo conjunto** (23/11): los valores de ACU son optimistas hasta confirmarlos con textos nuevos (tarea 4.2). El resultado principal es el informe con los umbrales iniciales.']),
        ...(withModel ? [`- Gasto del modelo: USD ${spent.toFixed(4)}${failures ? `; ${failures} textos sin respuesta válida (van a revisión)` : ''}`] : []),
        '- Una categoría cuenta como detectada si la marca una regla o si el modelo le da una confianza igual o mayor a su umbral de revisión. Los textos con datos de contacto no se envían al modelo, igual que en la API.',
        '',
        '## Indicadores de la política (sección 11)',
        '',
        indicatorsTable(current),
        '',
        withModel ? '' : 'Sin el modelo, TER, ACU y TEMA no tienen detector, y las tasas de rechazo y de revisión no se informan: toda reseña sin datos de contacto iría a revisión humana.\n',
        '## Por categoría (una contra el resto)',
        '',
        categoriesTable(current),
        '',
        'VP: el texto la tiene y el sistema la detectó. FP: la detectó sin que la tenga. FN: la tiene y no la detectó. VN: ni la tiene ni la detectó. «—»: no se puede calcular (ningún texto detectado o ninguno con la categoría).',
        '',
    ];
    if (runs.length) {
        lines.push('## Barrido de umbrales (para recalibrar, política sección 12)', '',
            initial ? 'ACU usa el mismo umbral de revisión que las demás.' : `ACU queda fijo en ${num(thresholds.acu)}.`, '', sweepTable(runs, thresholds), '',
            '## Barrido del umbral de ACU', '', `Las demás categorías quedan en ${num(thresholds.review)} y ${num(thresholds.reject)}.`, '', acuTable(acuRuns, thresholds), '');
    }
    if (kappa) {
        lines.push('## Acuerdo entre las dos personas (kappa de Cohen)', '',
            '| Categoría | Kappa | Acuerdo simple |', '| --- | --- | --- |',
            ...kappa.map(k => `| ${k.label} | ${num(k.kappa)} | ${pct(k.agree)} |`), '');
    }

    const md = join(RESULTS, `${name}.md`);
    writeFileSync(md, lines.filter((l, i, all) => !(l === '' && all[i - 1] === '')).join('\n'));
    writeFileSync(join(RESULTS, `${name}.json`), JSON.stringify({
        fecha: date, referencia: kind, predicciones: basename(predictionsPath), modelo: withModel ? model : null,
        versionPrompt: withModel ? prompt : null, gastoUsd: spent, umbrales: which, actual: current, barrido: runs, barridoAcu: acuRuns, acuerdo: kappa,
    }, null, 2) + '\n');

    console.log(`Informe: ${md}`);
    for (const i of current.indicators) console.log(`  ${i.name}: ${i.value === null ? '—' : i.value.toFixed(3)} (${verdict(i).replace(/\*/g, '')})`);
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
