import { INestApplication } from '@nestjs/common';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { CategoryScores } from 'src/moderation/domain/model/moderation';
import { ClassifierResult, TextClassifier } from 'src/moderation/domain/port/text-classifier.port';
import { adminToken, bearer, createTestApp, userToken } from './setup/helpers';

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };

/** Clasificador falso: no llama a ninguna API. Responde según una palabra clave del texto. */
class FakeClassifier extends TextClassifier {
    calls = 0;
    async classify(text: string): Promise<ClassifierResult> {
        this.calls++;
        if (text.includes('FALLA')) return { ok: false, failure: 'error', costUsd: 0 };
        const scores = { ...zero };
        if (text.includes('Ramírez')) scores.TER = 0.9;
        if (text.includes('acosa')) scores.ACU = 0.95;
        return { ok: true, classification: { scores, provider: 'prueba', model: 'modelo-prueba', promptVersion: 'v-prueba', costUsd: 0.001, reason: 'motivo de prueba' } };
    }
}

describe('Moderación (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let admin: string;
    const classifier = new FakeClassifier();
    const evaluate = (loBueno: string, aMejorar: string) =>
        http.post('/moderation/evaluate').set(bearer(admin)).send({ loBueno, aMejorar }).expect(200).then((r) => r.body);

    beforeAll(async () => {
        app = await createTestApp({ configure: (b) => b.overrideProvider(TextClassifier).useValue(classifier) });
        http = request(app.getHttpServer());
        admin = await adminToken(app);
    });
    afterAll(() => app.close());

    it('solo el administrador puede usar los endpoints', async () => {
        await http.post('/moderation/evaluate').send({ loBueno: 'a', aMejorar: 'b' }).expect(401);
        const { token } = await userToken(app);
        await http.post('/moderation/evaluate').set(bearer(token)).send({ loBueno: 'a', aMejorar: 'b' }).expect(403);
        await http.get('/moderation/spend').set(bearer(token)).expect(403);
    });

    it('valida el cuerpo', () =>
        http.post('/moderation/evaluate').set(bearer(admin)).send({ loBueno: '', aMejorar: 'x'.repeat(1001) }).expect(400));

    it('publica la crítica a la empresa', async () => {
        const v = await evaluate('Pagan en fecha y te dan uniforme.', 'La empresa no paga las horas extra y eso es ilegal.');
        expect(v).toMatchObject({ resultado: 'publicada', categoria: null, origen: 'modelo', modelo: 'modelo-prueba' });
    });

    it('rechaza datos de contacto por regla, sin llamar al modelo', async () => {
        const before = classifier.calls;
        const v = await evaluate('Buen ambiente.', 'Escribime al 0981 456 789 y te cuento.');
        expect(v).toMatchObject({ resultado: 'rechazada', categoria: 'DP', origen: 'reglas', confianzas: null, costoUsd: 0 });
        expect(v.mensaje).toContain('Sacalos');
        expect(classifier.calls).toBe(before);
    });

    it('rechaza con 0,85 o más y manda las acusaciones a revisión', async () => {
        expect(await evaluate('Buen sueldo.', 'El encargado Ramírez nos grita todo el día.')).toMatchObject({ resultado: 'rechazada', categoria: 'TER' });
        expect(await evaluate('Buen sueldo.', 'La supervisora acosa a las cajeras nuevas.')).toMatchObject({ resultado: 'en_revision', categoria: 'ACU', motivoModelo: 'motivo de prueba' });
    });

    it('si el modelo falla, va a revisión', async () => {
        expect(await evaluate('Buen sueldo.', 'FALLA del servicio de prueba.')).toMatchObject({ resultado: 'en_revision', falla: 'error' });
    });

    it('registra cada decisión con la huella del texto, nunca el texto, y suma el gasto del mes', async () => {
        const loBueno = 'Texto único para el registro.';
        const aMejorar = `Nada que mejorar ${Date.now()}.`;
        const before = (await http.get('/moderation/spend').set(bearer(admin)).expect(200)).body.gastoUsd;
        await evaluate(loBueno, aMejorar);
        const spend = (await http.get('/moderation/spend').set(bearer(admin)).expect(200)).body;
        expect(spend.gastoUsd).toBeCloseTo(before + 0.001, 6);
        expect(spend).toMatchObject({ topeUsd: expect.any(Number), modelo: expect.any(String), conClave: expect.any(Boolean) });

        const hash = createHash('sha256').update(`Lo bueno: ${loBueno}\nA mejorar: ${aMejorar}`).digest('hex');
        const rows = await app.get(DataSource).query('SELECT * FROM decisiones_moderacion WHERE huella_texto = $1', [hash]);
        expect(rows).toHaveLength(1);
        expect(JSON.stringify(rows[0])).not.toContain('Texto único');
        expect(rows[0]).toMatchObject({ resultado: 'publicada', modelo: 'modelo-prueba', version_instruccion: 'v-prueba' });
    });
});
