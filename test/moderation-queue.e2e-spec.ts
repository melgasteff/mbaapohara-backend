import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CategoryScores } from 'src/moderation/domain/model/moderation';
import { ClassifierResult, TextClassifier } from 'src/moderation/domain/port/text-classifier.port';
import { adminToken, bearer, createTestApp, unique, userToken } from './setup/helpers';

// Tarea 3.9a: cola de revisión humana y cargos propuestos (clasificador simulado).

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };
const GOOD = 'Pagan en fecha y el ambiente es bueno, con contrato firmado desde el primer día.';
const IMPROVE = 'Las horas extra se pagan con atraso y los turnos se avisan con poca anticipación.';

/** «REVISAR» simula una posible acusación (ACU 0,7: siempre revisión humana); lo demás se publica. */
class FakeClassifier extends TextClassifier {
    async classify(text: string): Promise<ClassifierResult> {
        const scores = { ...zero, ACU: text.includes('REVISAR') ? 0.7 : 0 };
        return { ok: true, classification: { scores, provider: 'prueba', model: 'modelo-prueba', promptVersion: 'v-prueba', costUsd: 0, reason: 'posible acusación' } };
    }
}

describe('Cola de revisión humana y cargos propuestos (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let db: DataSource;
    let admin: string;
    let local: number;
    let base: Record<string, unknown>;

    const publish = (token: string, overrides: Record<string, unknown> = {}) =>
        http.post('/reviews').set(bearer(token)).send({ ...base, ...overrides }).expect(201).then(r => r.body);
    const queue = () => http.get('/moderation/queue').query({ pageSize: 100 }).set(bearer(admin)).expect(200).then(r => r.body);
    const versionOf = async (reviewId: number) =>
        (await db.query('SELECT max(id) AS id FROM versiones_resena WHERE id_resena = $1', [reviewId]))[0].id as number;

    beforeAll(async () => {
        app = await createTestApp({ configure: (b) => b.overrideProvider(TextClassifier).useValue(new FakeClassifier()) });
        http = request(app.getHttpServer());
        db = app.get(DataSource);
        admin = await adminToken(app);
        const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id;
        const empresa = await one(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT min(id) FROM rubros), 'aprobada') RETURNING id`, [unique('Empresa Ficticia')]);
        local = await one(`INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, (SELECT min(id) FROM ciudades), $2, 'aprobada') RETURNING id`, [empresa, unique('Casa central')]);
        const categoria = await one(`INSERT INTO categorias (codigo, descripcion) VALUES ($1, $2) RETURNING id`, [unique('CAT'), unique('Categoría')]);
        await db.query(`INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, 1)`, [unique('COLA'), unique('Ítem'), categoria]);
        const active: { codigo: string }[] = await db.query(
            'SELECT i.codigo FROM items i JOIN categorias c ON c.id = i.id_categoria WHERE i.activo AND c.activo AND i.codigo IS NOT NULL');
        base = {
            idLocal: local, idCargo: await one(`SELECT min(id) AS id FROM cargos WHERE estado = 'aprobada'`), situacion: 'ACTUAL',
            idTipoContrato: await one('SELECT min(id) AS id FROM tipo_contrato'), idModalidad: await one('SELECT min(id) AS id FROM modalidades'),
            calificacion: 4, loBueno: GOOD, aMejorar: IMPROVE, respuestas: Object.fromEntries(active.map(c => [c.codigo, 'SI'])),
        };
    });
    afterAll(() => app.close());

    it('solo el administrador ve y decide la cola', async () => {
        const { token } = await userToken(app);
        await http.get('/moderation/queue').expect(401);
        await http.get('/moderation/queue').set(bearer(token)).expect(403);
        await http.patch('/moderation/queue/1/publish').set(bearer(token)).expect(403);
        await http.get('/jobs/admin').set(bearer(token)).expect(403);
    });

    it('la cola muestra la versión en revisión con sus señales y sin el autor', async () => {
        const { token, email, id: userId } = await userToken(app);
        const { id, estado } = await publish(token, { aMejorar: `${IMPROVE} REVISAR` });
        expect(estado).toBe('en_revision');
        const { data } = await queue();
        const item = data.find((v: { idResena: number }) => v.idResena === id);
        expect(item).toMatchObject({
            numero: 1, situacion: 'ACTUAL', horasEsperando: 0, tieneVersionPublicada: false,
            senales: { category: 'ACU', modelReason: 'posible acusación', scores: expect.objectContaining({ ACU: 0.7 }) },
        });
        const json = JSON.stringify(item);
        expect(json).not.toContain(email);
        expect(Object.keys(item)).not.toEqual(expect.arrayContaining(['idUsuario', 'usuario', 'email']));
        expect(userId).toBeGreaterThan(0);
    });

    it('publicar la hace visible, la saca de la cola y queda en el registro con el administrador', async () => {
        const { token } = await userToken(app);
        const { id } = await publish(token, { aMejorar: `${IMPROVE} REVISAR` });
        const version = await versionOf(id);
        await http.get(`/reviews/${id}`).expect(404);

        const { body } = await http.patch(`/moderation/queue/${version}/publish`).set(bearer(admin)).expect(200);
        expect(body).toEqual({ idResena: id, estado: 'publicada' });
        await http.get(`/reviews/${id}`).expect(200);
        expect((await queue()).data.map((v: { idVersion: number }) => v.idVersion)).not.toContain(version);
        const [decision] = await db.query(
            `SELECT resultado, id_administrador FROM decisiones_moderacion WHERE id_version_resena = $1 AND origen = 'persona'`, [version]);
        expect(decision).toEqual({ resultado: 'publicada', id_administrador: expect.any(Number) });

        // Ya decidida: no se vuelve a decidir.
        await http.patch(`/moderation/queue/${version}/reject`).set(bearer(admin)).send({ categoria: 'ACU', motivo: 'Motivo suficientemente largo.' }).expect(409);
        await http.patch('/moderation/queue/999999/publish').set(bearer(admin)).expect(404);
    });

    it('rechazar deja el motivo en «Mis reseñas» y, si había una versión publicada, sigue esa', async () => {
        const { token } = await userToken(app);
        const { id } = await publish(token);
        await http.put(`/reviews/${id}`).set(bearer(token)).send({ ...base, idLocal: undefined, aMejorar: `${IMPROVE} REVISAR` }).expect(200);
        const version = await versionOf(id);
        expect((await queue()).data.find((v: { idVersion: number }) => v.idVersion === version)).toMatchObject({ numero: 2, tieneVersionPublicada: true });

        await http.patch(`/moderation/queue/${version}/reject`).set(bearer(admin)).send({ categoria: 'NADA', motivo: 'x' }).expect(400);
        const motivo = 'Tu reseña acusa de un delito a una persona. Contá el hecho sobre la empresa.';
        await http.patch(`/moderation/queue/${version}/reject`).set(bearer(admin)).send({ categoria: 'ACU', motivo }).expect(200);

        const { body: [mine] } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
        expect(mine).toMatchObject({ publicada: true, ultimaVersion: { numero: 2, estado: 'rechazada', categoria: 'ACU', motivo } });
        expect((await http.get(`/reviews/${id}`).expect(200)).body.aMejorar).toBe(IMPROVE);
        // Rechazada, se puede volver a editar.
        await http.put(`/reviews/${id}`).set(bearer(token)).send({ ...base, idLocal: undefined }).expect(200);
    });

    it('cargos propuestos: el administrador los ve pendientes y los aprueba o rechaza', async () => {
        const { token } = await userToken(app);
        const proposed = unique('Repositor de góndola');
        const { id } = await publish(token, { idCargo: undefined, cargoPropuesto: proposed });
        const { body: pending } = await http.get('/jobs/admin').query({ estado: 'pendiente', pageSize: 100 }).set(bearer(admin)).expect(200);
        const job = pending.data.find((j: { descripcion: string }) => j.descripcion === proposed);
        expect(job).toMatchObject({ estado: 'pendiente' });
        expect((await http.get(`/reviews/${id}`).expect(200)).body.cargo).toBeNull();

        await http.patch(`/jobs/${job.id}/approve`).set(bearer(admin)).expect(200);
        expect((await http.get(`/reviews/${id}`).expect(200)).body.cargo).toBe(proposed);
        await http.get(`/jobs/${job.id}`).expect(200);
        await http.patch(`/jobs/${job.id}/reject`).set(bearer(admin)).expect(409);

        const other = unique('Otro cargo propuesto');
        await publish((await userToken(app)).token, { idCargo: undefined, cargoPropuesto: other });
        const [{ id: otherId }] = await db.query('SELECT id FROM cargos WHERE descripcion = $1', [other]);
        expect((await http.patch(`/jobs/${otherId}/reject`).set(bearer(admin)).expect(200)).body.estado).toBe('rechazada');
        await http.get(`/jobs/${otherId}`).expect(404);
    });
});
