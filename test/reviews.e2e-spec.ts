import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CategoryScores } from 'src/moderation/domain/model/moderation';
import { ClassifierResult, TextClassifier } from 'src/moderation/domain/port/text-classifier.port';
import { bearer, createTestApp, unique, userToken } from './setup/helpers';

// Tarea 3.3: publicar, editar, borrar y consultar reseñas con la moderación integrada (clasificador simulado).

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };
const GOOD = 'Pagan en fecha y el ambiente es bueno, con contrato firmado desde el primer día.';
const IMPROVE = 'Las horas extra se pagan con atraso y los turnos se avisan con poca anticipación.';

/** Clasificador falso: «FALLA» simula un error del servicio (revisión humana); «Ramírez», una persona identificable. */
class FakeClassifier extends TextClassifier {
    async classify(text: string): Promise<ClassifierResult> {
        if (text.includes('FALLA')) return { ok: false, failure: 'error', costUsd: 0 };
        const scores = { ...zero, TER: text.includes('Ramírez') ? 0.95 : 0 };
        return { ok: true, classification: { scores, provider: 'prueba', model: 'modelo-prueba', promptVersion: 'v-prueba', costUsd: 0, reason: 'motivo' } };
    }
}

describe('Reseñas (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let db: DataSource;
    let ref: { empresa: number; local: number; otroLocal: number; cargo: number; contrato: number; modalidad: number; ciudad: number };
    let respuestas: Record<string, string>;

    const body = (overrides: Record<string, unknown> = {}) => ({
        idLocal: ref.local, idCargo: ref.cargo, situacion: 'ANTERIOR', ultimoAnio: 2025, idTipoContrato: ref.contrato,
        idModalidad: ref.modalidad, calificacion: 4, loBueno: GOOD, aMejorar: IMPROVE, respuestas, ...overrides,
    });
    const publish = (token: string, overrides: Record<string, unknown> = {}) =>
        http.post('/reviews').set(bearer(token)).send(body(overrides));
    /** Al editar no se manda el local (no cambia). */
    const editBody = (overrides: Record<string, unknown> = {}) => {
        const full: Record<string, unknown> = body(overrides);
        delete full.idLocal;
        return full;
    };
    const publicIds = async (query: Record<string, unknown> = {}) =>
        (await http.get('/reviews').query({ pageSize: 100, ...query }).expect(200)).body.data.map((r: { id: number }) => r.id);

    beforeAll(async () => {
        app = await createTestApp({ configure: (b) => b.overrideProvider(TextClassifier).useValue(new FakeClassifier()) });
        http = request(app.getHttpServer());
        db = app.get(DataSource);
        const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id;
        const empresa = await one(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT min(id) FROM rubros), 'aprobada') RETURNING id`, [unique('Empresa Ficticia')]);
        const ciudad = await one('SELECT min(id) AS id FROM ciudades');
        const office = (name: string) => one(`INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, $2, $3, 'aprobada') RETURNING id`, [empresa, ciudad, unique(name)]);
        ref = {
            empresa, ciudad, local: await office('Casa central'), otroLocal: await office('Sucursal norte'),
            cargo: await one(`SELECT min(id) AS id FROM cargos WHERE estado = 'aprobada'`),
            contrato: await one('SELECT min(id) AS id FROM tipo_contrato'),
            modalidad: await one('SELECT min(id) AS id FROM modalidades'),
        };
        // Criterios provisionales de prueba, más los activos que hayan creado otras suites: hay que responderlos todos.
        const categoria = await one(`INSERT INTO categorias (codigo, descripcion, orden) VALUES ($1, $2, 1) RETURNING id`, [unique('CAT'), unique('Categoría')]);
        for (const [i, code] of ['E2E-A', 'E2E-B'].entries()) {
            await db.query(`INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, $4)`, [unique(code), unique('Ítem'), categoria, i + 1]);
        }
        const active: { codigo: string }[] = await db.query(
            'SELECT i.codigo FROM items i JOIN categorias c ON c.id = i.id_categoria WHERE i.activo AND c.activo AND i.codigo IS NOT NULL');
        respuestas = Object.fromEntries(active.map((c, i) => [c.codigo, ['SI', 'EN_PARTE', 'NO', 'NO_SABE'][i % 4]]));
    });
    afterAll(() => app.close());

    it('publicar exige sesión; leer es público', async () => {
        await http.post('/reviews').send(body()).expect(401);
        await http.get('/reviews').expect(200);
    });

    it('publica una reseña y aparece en el listado público, sin autor ni fechas exactas', async () => {
        const { token, email, id: userId } = await userToken(app);
        const { body: result } = await publish(token).expect(201);
        expect(result).toEqual({ id: expect.any(Number), estado: 'publicada' });

        const { body: page } = await http.get('/reviews').query({ local: ref.local }).expect(200);
        const review = page.data.find((r: { id: number }) => r.id === result.id);
        expect(review).toMatchObject({
            empresa: { id: ref.empresa }, local: { id: ref.local }, situacion: 'ANTERIOR', ultimoAnio: 2025, calificacion: 4,
            loBueno: GOOD, aMejorar: IMPROVE, mesPublicacion: expect.stringMatching(/^\d{4}-\d{2}$/),
        });
        expect(review.respuestas).toHaveLength(Object.keys(respuestas).length);
        expect(review.respuestas[0]).toEqual({ codigo: expect.any(String), respuesta: expect.stringMatching(/^(SI|EN_PARTE|NO|NO_SABE)$/) });
        // Anonimato: ni el correo, ni el id de la cuenta, ni fechas completas.
        const json = JSON.stringify(review);
        expect(json).not.toContain(email);
        expect(Object.keys(review)).not.toEqual(expect.arrayContaining(['idUsuario', 'usuario', 'autor']));
        expect(json).not.toMatch(/\d{4}-\d{2}-\d{2}/);
        expect(userId).toBeGreaterThan(0);

        const { body: detail } = await http.get(`/reviews/${result.id}`).expect(200);
        expect(detail.id).toBe(result.id);
    });

    it('una reseña por persona y local; se puede reseñar otro local', async () => {
        const { token } = await userToken(app);
        await publish(token).expect(201);
        const { body: error } = await publish(token).expect(409);
        expect(error.message).toContain('Mis reseñas');
        await publish(token, { idLocal: ref.otroLocal }).expect(201);
    });

    it('valida la forma de la reseña y explica cada problema', async () => {
        const { token } = await userToken(app);
        const [first, ...rest] = Object.keys(respuestas);
        const { body: error } = await publish(token, {
            respuestas: Object.fromEntries(rest.map(code => [code, 'SI'])), loBueno: 'Muy corto', ultimoAnio: null,
        }).expect(400);
        expect(error.problemas).toEqual(expect.arrayContaining([
            expect.stringContaining('Lo bueno'), expect.stringContaining('último año'), expect.stringContaining(first),
        ]));
        await publish(token, { respuestas: { ...respuestas, [first]: 'TAL_VEZ' } }).expect(400);
        await publish(token, { cargoPropuesto: 'Repositor' }).expect(400); // cargo de la lista y propuesto a la vez
        await publish(token, { idLocal: 999999 }).expect(400);
        await publish(token, { calificacion: 6 }).expect(400);
        await publish(token, { campoExtra: 1 }).expect(400);
        const { body: mine } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
        expect(mine).toEqual([]);
    });

    it('con situación actual ignora el año', async () => {
        const { token } = await userToken(app);
        const { body: result } = await publish(token, { situacion: 'ACTUAL', ultimoAnio: 2026 }).expect(201);
        const { body: review } = await http.get(`/reviews/${result.id}`).expect(200);
        expect(review).toMatchObject({ situacion: 'ACTUAL', ultimoAnio: null });
    });

    it('rechazada por datos de contacto: no es pública y la persona ve el motivo en «Mis reseñas»', async () => {
        const { token } = await userToken(app);
        const { body: result } = await publish(token, { aMejorar: `${IMPROVE} Escribime al 0981 123 456.` }).expect(201);
        expect(result).toMatchObject({ estado: 'rechazada', categoria: 'DP', motivo: expect.stringContaining('datos de contacto') });
        await http.get(`/reviews/${result.id}`).expect(404);
        expect(await publicIds()).not.toContain(result.id);

        const { body: mine } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
        expect(mine).toEqual([expect.objectContaining({
            id: result.id, publicada: false,
            empresa: { id: expect.any(Number), nombre: expect.any(String), grupo: expect.stringMatching(/^(comercio|industria|servicios|gastronomia|transporte|agro-otros)$/) },
            ultimaVersion: expect.objectContaining({ numero: 1, estado: 'rechazada', categoria: 'DP', situacion: 'ANTERIOR' }),
        })]);
    });

    it('editar: la versión publicada sigue visible si la nueva se rechaza, y se reemplaza si se publica', async () => {
        const { token } = await userToken(app);
        const { body: { id } } = await publish(token).expect(201);

        const { body: rejected } = await http.put(`/reviews/${id}`).set(bearer(token))
            .send(editBody({ aMejorar: `${IMPROVE} El encargado Ramírez nos grita.` })).expect(200);
        expect(rejected).toMatchObject({ estado: 'rechazada', categoria: 'TER' });
        expect((await http.get(`/reviews/${id}`).expect(200)).body.aMejorar).toBe(IMPROVE);

        await http.put(`/reviews/${id}`).set(bearer(token)).send(editBody({ calificacion: 2 })).expect(200);
        expect((await http.get(`/reviews/${id}`).expect(200)).body.calificacion).toBe(2);
        const { body: [mine] } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
        expect(mine.ultimaVersion).toMatchObject({ numero: 3, estado: 'publicada', calificacion: 2 });
    });

    it('con el servicio de moderación caído queda en revisión y no se puede editar hasta que se decida', async () => {
        const { token } = await userToken(app);
        const { body: result } = await publish(token, { loBueno: `${GOOD} FALLA` }).expect(201);
        expect(result).toMatchObject({ estado: 'en_revision', motivo: expect.stringContaining('revisión') });
        await http.get(`/reviews/${result.id}`).expect(404);
        const { body: error } = await http.put(`/reviews/${result.id}`).set(bearer(token)).send(editBody()).expect(409);
        expect(error.message).toContain('en revisión');
    });

    it('la decisión de moderación queda registrada con la reseña y la versión, y anónima al borrar', async () => {
        const { token } = await userToken(app);
        const { body: { id } } = await publish(token).expect(201);
        const [decision] = await db.query('SELECT id, id_version_resena FROM decisiones_moderacion WHERE id_resena = $1', [id]);
        expect(decision.id_version_resena).toEqual(expect.any(Number));

        await http.delete(`/reviews/${id}`).set(bearer(token)).expect(204);
        await http.get(`/reviews/${id}`).expect(404);
        expect(await db.query('SELECT 1 FROM versiones_resena WHERE id_resena = $1', [id])).toHaveLength(0);
        const [kept] = await db.query('SELECT id_resena, id_version_resena FROM decisiones_moderacion WHERE id = $1', [decision.id]);
        expect(kept).toEqual({ id_resena: null, id_version_resena: null });
        await publish(token).expect(201); // borrada, puede volver a reseñar el local
    });

    it('nadie edita ni borra la reseña de otra persona (responde 404)', async () => {
        const owner = await userToken(app);
        const other = await userToken(app);
        const { body: { id } } = await publish(owner.token).expect(201);
        await http.put(`/reviews/${id}`).set(bearer(other.token)).send(editBody()).expect(404);
        await http.delete(`/reviews/${id}`).set(bearer(other.token)).expect(404);
        await http.get(`/reviews/${id}`).expect(200);
    });

    it('un cargo propuesto queda pendiente y se muestra como «otro cargo» (null)', async () => {
        const { token } = await userToken(app);
        const proposed = unique('Repositor de góndola');
        const { body: { id } } = await publish(token, { idCargo: undefined, cargoPropuesto: proposed }).expect(201);
        expect((await http.get(`/reviews/${id}`).expect(200)).body.cargo).toBeNull();
        const [cargo] = await db.query('SELECT estado FROM cargos WHERE descripcion = $1', [proposed]);
        expect(cargo.estado).toBe('pendiente');
        const { body: [mine] } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
        expect(mine.ultimaVersion.cargo).toMatchObject({ descripcion: proposed, aprobado: false });
    });

    it('filtra por situación, contrato, modalidad, ciudad y empresa (RF5), con paginación', async () => {
        const { token } = await userToken(app);
        const { body: { id } } = await publish(token, { idLocal: ref.otroLocal, situacion: 'ACTUAL' }).expect(201);
        expect(await publicIds({ local: ref.otroLocal, situacion: 'ACTUAL' })).toContain(id);
        expect(await publicIds({ local: ref.otroLocal, situacion: 'ANTERIOR' })).not.toContain(id);
        expect(await publicIds({ empresa: ref.empresa, ciudad: ref.ciudad, tipoContrato: ref.contrato, modalidad: ref.modalidad, cargo: ref.cargo })).toContain(id);
        expect(await publicIds({ tipoContrato: 999999 })).toEqual([]);
        const { body: page } = await http.get('/reviews').query({ empresa: ref.empresa, pageSize: 1 }).expect(200);
        expect(page).toMatchObject({ page: 1, pageSize: 1, data: [expect.any(Object)] });
        expect(page.total).toBeGreaterThan(1);
    });
});
