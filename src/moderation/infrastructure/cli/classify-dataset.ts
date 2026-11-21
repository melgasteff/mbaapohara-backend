// Clasifica el conjunto de evaluación (tarea 2.2) con el mismo sistema que la API: reglas locales y, si las reglas no
// encontraron datos de contacto, el modelo. Tarea 2.4.
//   npm run moderation:classify                  reglas + modelo (pide confirmar el gasto antes de empezar)
//   npm run moderation:classify -- --solo-reglas sin el modelo: no necesita clave ni gasta
//   npm run moderation:classify -- --si          no pregunta (por ejemplo, fuera de una terminal)
// No escribe en la base: estos textos no son reseñas, así que no van al registro de moderación ni consumen el tope
// mensual. El gasto queda en el archivo de predicciones. Si se corta, al volver a correrlo sigue donde quedó.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import { config as loadEnv } from 'dotenv';
import { CATEGORIES, joinReviewText, RuleSignal } from '../../domain/model/moderation';
import { decide } from '../../domain/model/decision-policy';
import { csvRecords, Prediction, toCsv } from '../../application/evaluation/metrics';
import { AnthropicClassifier } from '../anthropic/anthropic-classifier';
import { PROMPT_VERSION } from '../anthropic/classifier-prompt';
import { KeywordLocalRules } from '../rules/keyword-local-rules';

loadEnv({ path: '.env' });

const DATASET = join(process.cwd(), 'docs/moderacion/conjunto-evaluacion.csv');
const RESULTS = join(process.cwd(), 'docs/moderacion/resultados');
const HEADER = ['id', 'reglas', ...CATEGORIES, 'fallo', 'resultado', 'categoria', 'costo_usd', 'modelo', 'version_prompt'];

/** Fila guardada de una predicción, con lo necesario para recalcular las métricas sin volver a llamar al modelo. */
interface Row extends Prediction {
    outcome: string;
    category: string;
    costUsd: number;
    model: string;
    promptVersion: string;
}

const flag = (name: string) => process.argv.includes(name);
const option = (name: string, fallback: number) => {
    const index = process.argv.indexOf(name);
    return index >= 0 ? Number(process.argv[index + 1]) : fallback;
};

/** Filas ya clasificadas sin falla de un archivo anterior, para no volver a pagarlas. */
function previous(path: string): Map<string, Row> {
    if (!existsSync(path)) return new Map();
    return new Map(csvRecords(readFileSync(path, 'utf8')).filter(r => !r.fallo).map(r => [r.id, {
        id: r.id,
        rules: (r.reglas ? r.reglas.split('|') : []) as RuleSignal[],
        scores: r.DP === '' ? null : Object.fromEntries(CATEGORIES.map(c => [c, Number(r[c])])) as Prediction['scores'],
        failure: null, outcome: r.resultado, category: r.categoria, costUsd: Number(r.costo_usd),
        model: r.modelo, promptVersion: r.version_prompt,
    }]));
}

function save(path: string, rows: Row[]): void {
    const sorted = [...rows].sort((a, b) => a.id.localeCompare(b.id));
    writeFileSync(path, toCsv(HEADER, sorted.map(r => [
        r.id, r.rules.join('|'), ...CATEGORIES.map(c => (r.scores ? r.scores[c] : '')), r.failure ?? '',
        r.outcome, r.category, r.costUsd.toFixed(6), r.model, r.promptVersion,
    ])));
}

async function confirm(question: string): Promise<boolean> {
    if (flag('--si')) return true;
    if (!process.stdin.isTTY) throw new Error('Para correr sin terminal, agregá --si');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>(resolve => rl.question(question, resolve));
    rl.close();
    return /^s/i.test(answer.trim());
}

async function main() {
    const rulesOnly = flag('--solo-reglas');
    const model = process.env.MODERATION_MODEL || 'claude-haiku-5-5';
    const apiKey = process.env.ANTHROPIC_API_KEY || undefined;
    if (!rulesOnly && !apiKey) {
        throw new Error('Falta ANTHROPIC_API_KEY en .env. Para medir solo las reglas: npm run moderation:classify -- --solo-reglas');
    }

    const texts = csvRecords(readFileSync(DATASET, 'utf8'));
    mkdirSync(RESULTS, { recursive: true });
    const output = join(RESULTS, rulesOnly ? 'predicciones-reglas.csv' : `predicciones-${model}-${PROMPT_VERSION}.csv`);
    const done = previous(output);
    const pending = texts.filter(t => !done.has(t.id));

    const rules = new KeywordLocalRules();
    const classifier = rulesOnly ? null : new AnthropicClassifier({ apiKey, model, timeoutMs: Number(process.env.MODERATION_TIMEOUT_MS) || 10000 });

    if (classifier && pending.length) {
        // Estimación con los precios de Claude Haiku 5.5 (USD 0,10 / 0,50 por millón): unos 1.200 tokens de entrada
        // por texto (instrucción + reseña) y de 150 a 600 de salida. El costo real lo informa la API en cada respuesta.
        const low = (pending.length * (1200 * 0.1 + 150 * 0.5)) / 1e6;
        const high = (pending.length * (1200 * 0.1 + 600 * 0.5)) / 1e6;
        console.log(`Se van a enviar al modelo ${model} hasta ${pending.length} textos (los que tienen datos de contacto no se envían).`);
        console.log(`Gasto estimado: entre USD ${low.toFixed(2)} y ${high.toFixed(2)}. No cuenta para el tope mensual de la moderación.`);
        if (!(await confirm('¿Seguir? (s/N) '))) {
            console.log('Cancelado: no se envió nada.');
            return;
        }
    }

    const rows = [...done.values()];
    let index = 0;
    let failures = 0;
    const concurrency = Math.max(1, option('--concurrencia', 4));
    const worker = async () => {
        while (index < pending.length) {
            const text = pending[index++];
            const joined = joinReviewText({ loBueno: text.lo_bueno, aMejorar: text.a_mejorar });
            const signals = rules.check(joined);
            // Igual que la API: con datos de contacto se rechaza por las reglas y el modelo no se consulta.
            const result = classifier && !signals.includes('datos_contacto') ? await classifier.classify(joined) : null;
            const scores = result?.ok === true ? result.classification.scores : null;
            const failure = result && result.ok === false ? result.failure : null;
            if (failure) failures++;
            const decision = decide({ rules: signals, scores, failure });
            rows.push({
                id: text.id, rules: signals, scores, failure, outcome: decision.outcome, category: decision.category ?? '',
                costUsd: result ? (result.ok === true ? result.classification.costUsd : result.costUsd) : 0,
                model: classifier ? model : 'reglas', promptVersion: classifier ? PROMPT_VERSION : '',
            });
            if (rows.length % 20 === 0) {
                save(output, rows);
                console.log(`${rows.length} de ${texts.length} textos`);
            }
        }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    save(output, rows);

    const spent = rows.reduce((sum, r) => sum + r.costUsd, 0);
    console.log(`Listo: ${rows.length} textos en ${output}`);
    if (classifier) console.log(`Gasto total del archivo: USD ${spent.toFixed(4)}`);
    if (failures) console.log(`${failures} textos fallaron (sin respuesta válida del modelo): al volver a correr el comando se reintentan.`);
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
