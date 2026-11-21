import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CategoryScores } from 'src/moderation/domain/model/moderation';
import { ClassifierResult, TextClassifier } from 'src/moderation/domain/port/text-classifier.port';
import { adminToken, bearer, createTestApp, unique, uniqueEmail, userToken } from './setup/helpers';

// Tarea 3.9b: reportes de reseñas publicadas y solicitudes de empresas (clasificador simulado: todo se publica).

const zero: CategoryScores = { DP: 0, TER: 0, ACU: 0, INS: 0, SPAM: 0, TEMA: 0 };
const GOOD = 'Pagan en fecha y el ambiente es bueno, con contrato firmado desde el primer día.';
const IMPROVE = 'Las horas extra se pagan con atraso y los turnos se avisan con poca anticipación.';

class FakeClassifier extends TextClassifier {
    async classify(): Promise<ClassifierResult> {
        return { ok: true, classification: { scores: zero, provider: 'prueba', model: 'modelo-prueba', promptVersion: 'v-prueba', costUsd: 0, reason: '' } };
    }
}

describe('Reportes y solicitudes de empresas (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let db: DataSource;
    let admin: string;
    let empresa: number;
    let base: Record<string, unknown>;

    /** Publica una reseña con una cuenta nueva; devuelve el id y el token del autor. */
    async function published(): Promise<{ id: number; token: string; email: string }> {
        const author = await userToken(app);
        const local = (await db.query(
            `INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, (SELECT min(id) FROM ciudades), $2, 'aprobada') RETURNING id`,
            [empresa, unique('Local')]))[0].id;
        const { body } = await http.post('/reviews').set(bearer(author.token)).send({ ...base, idLocal: local }).expect(201);
        expect(body.estado).toBe('publicada');
        return { id: body.id, token: author.token, email: author.email };
    }
    const report = (token: string, id: number, body: Record<string, unknown>) => http.post(`/reviews/${id}/reports`).set(bearer(token)).send(body);
    const pendingReports = () => http.get('/moderation/reports').query({ pageSize: 100 }).set(bearer(admin)).expect(200).then(r => r.body);

    beforeAll(async () => {
        app = await createTestApp({ configure: (b) => b.overrideProvider(TextClassifier).useValue(new FakeClassifier()) });
        http = request(app.getHttpServer());
        db = app.get(DataSource);
        admin = await adminToken(app);
        const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id;
        empresa = await one(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT min(id) FROM rubros), 'aprobada') RETURNING id`, [unique('Empresa Ficticia')]);
        const categoria = await one(`INSERT INTO categorias (codigo, descripcion) VALUES ($1, $2) RETURNING id`, [unique('CAT'), unique('Categoría')]);
        await db.query(`INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, 1)`, [unique('REP'), unique('Ítem'), categoria]);
        const active: { codigo: string }[] = await db.query(
            'SELECT i.codigo FROM items i JOIN categorias c ON c.id = i.id_categoria WHERE i.activo AND c.activo AND i.codigo IS NOT NULL');
        base = {
            idCargo: await one(`SELECT min(id) AS id FROM cargos WHERE estado = 'aprobada'`), situacion: 'ACTUAL',
            idTipoContrato: await one('SELECT min(id) AS id FROM tipo_contrato'), idModalidad: await one('SELECT min(id) AS id FROM modalidades'),
            calificacion: 4, loBueno: GOOD, aMejorar: IMPROVE, respuestas: Object.fromEntries(active.map(c => [c.codigo, 'SI'])),
        };
    });
    afterAll(() => app.close());

    describe('Reportes', () => {
        it('reportar exige sesión; una vez por cuenta; no las propias; la reseña sigue visible', async () => {
            const { id, token: authorToken } = await published();
            const { token } = await userToken(app);
            await http.post(`/reviews/${id}/reports`).send({ categoria: 'TER' }).expect(401);
            await report(token, id, { categoria: 'OTRO' }).expect(400);
            await report(token, id, { categoria: 'NADA' }).expect(400);
            const { body } = await report(token, id, { categoria: 'TER', comentario: 'Nombra al encargado del turno noche.' }).expect(201);
            expect(body.mensaje).toContain('sigue visible');
            await report(token, id, { categoria: 'SPAM' }).expect(409);
            await report(authorToken, id, { categoria: 'SPAM' }).expect(400);
            await report(token, 999999, { categoria: 'SPAM' }).expect(404);
            await http.get(`/reviews/${id}`).expect(200);
        });

        it('el administrador ve los reportes agrupados por reseña, sin el autor ni quién reportó', async () => {
            const { id, email } = await published();
            const reporters = [await userToken(app), await userToken(app)];
            await report(reporters[0].token, id, { categoria: 'TER' }).expect(201);
            await report(reporters[1].token, id, { categoria: 'OTRO', comentario: 'Parece escrita por la competencia.' }).expect(201);
            const { token } = await userToken(app);
            await http.get('/moderation/reports').set(bearer(token)).expect(403);

            const item = (await pendingReports()).data.find((r: { idResena: number }) => r.idResena === id);
            expect(item).toMatchObject({ publicada: true, cantidad: 2, loBueno: GOOD, reportes: [{ categoria: 'TER' }, { categoria: 'OTRO', comentario: 'Parece escrita por la competencia.' }] });
            const json = JSON.stringify(item);
            for (const mail of [email, ...reporters.map(r => r.email)]) expect(json).not.toContain(mail);
            expect(json).not.toMatch(/idUsuario|id_usuario/);
        });

        it('mantener cierra los reportes y la reseña sigue publicada', async () => {
            const { id } = await published();
            await report((await userToken(app)).token, id, { categoria: 'SPAM' }).expect(201);
            expect((await http.patch(`/moderation/reviews/${id}/keep`).set(bearer(admin)).expect(200)).body).toEqual({ reportesCerrados: 1 });
            expect((await pendingReports()).data.map((r: { idResena: number }) => r.idResena)).not.toContain(id);
            await http.get(`/reviews/${id}`).expect(200);
            await http.patch(`/moderation/reviews/${id}/keep`).set(bearer(admin)).expect(404);
        });

        it('retirar la oculta, la persona ve el motivo y puede editarla; queda en el registro', async () => {
            const { id, token } = await published();
            await report((await userToken(app)).token, id, { categoria: 'TER' }).expect(201);
            const motivo = 'Tu reseña nombra a una persona. Contá lo que pasó sin decir quién fue.';
            await http.patch(`/moderation/reviews/${id}/retire`).set(bearer(admin)).send({ categoria: 'TER', motivo: 'corto' }).expect(400);
            expect((await http.patch(`/moderation/reviews/${id}/retire`).set(bearer(admin)).send({ categoria: 'TER', motivo }).expect(200)).body)
                .toEqual({ idResena: id, reportesCerrados: 1 });

            await http.get(`/reviews/${id}`).expect(404);
            const { body: [mine] } = await http.get('/reviews/mine').set(bearer(token)).expect(200);
            expect(mine).toMatchObject({ publicada: false, ultimaVersion: { estado: 'rechazada', categoria: 'TER', motivo } });
            const [decision] = await db.query(`SELECT resultado, origen FROM decisiones_moderacion WHERE id_resena = $1 ORDER BY id DESC LIMIT 1`, [id]);
            expect(decision).toEqual({ resultado: 'rechazada', origen: 'persona' });
            await http.patch(`/moderation/reviews/${id}/retire`).set(bearer(admin)).send({ categoria: 'TER', motivo }).expect(409);

            const { idLocal: _l, ...edit } = { ...base, idLocal: 0 };
            expect((await http.put(`/reviews/${id}`).set(bearer(token)).send(edit).expect(200)).body.estado).toBe('publicada');
        });

        it('los reportes de una cuenta salen en su exportación y se borran con ella', async () => {
            const { id } = await published();
            const reporter = await userToken(app);
            await report(reporter.token, id, { categoria: 'INS' }).expect(201);
            const { body } = await http.get('/users/me/export').set(bearer(reporter.token)).expect(200);
            expect(body.reportes).toEqual([expect.objectContaining({ idResena: id, categoria: 'INS', estado: 'pendiente' })]);
            await db.query('DELETE FROM usuarios WHERE id = $1', [reporter.id]);
            expect(await db.query('SELECT 1 FROM reportes WHERE id_resena = $1', [id])).toHaveLength(0);
        });
    });

    describe('Solicitudes de empresas', () => {
        const valid = (overrides: Record<string, unknown> = {}) => ({
            tipo: 'correccion_datos', idEmpresa: empresa, nombre: 'Persona Ficticia', correo: uniqueEmail('empresa'),
            mensaje: 'La dirección de referencia del local central está desactualizada.', aceptaPrivacidad: true, ...overrides,
        });

        it('el formulario es público y valida la reseña o la empresa', async () => {
            expect((await http.post('/company-requests').send(valid()).expect(201)).body.mensaje).toContain('correo');
            await http.post('/company-requests').send(valid({ aceptaPrivacidad: false })).expect(400);
            await http.post('/company-requests').send(valid({ idEmpresa: 999999 })).expect(400);
            await http.post('/company-requests').send(valid({ tipo: 'revision_resena', idEmpresa: undefined })).expect(400);
            await http.post('/company-requests').send(valid({ tipo: 'revision_resena', idResena: 999999 })).expect(400);
            await http.post('/company-requests').send(valid({ correo: 'no-es-correo' })).expect(400);
        });

        it('el administrador ve la reseña afectada, responde y se borran el nombre y el correo', async () => {
            const { id } = await published();
            const correo = uniqueEmail('empresa');
            await http.post('/company-requests').send(valid({ tipo: 'revision_resena', idResena: id, idEmpresa: undefined, correo })).expect(201);
            const { token } = await userToken(app);
            await http.get('/moderation/company-requests').set(bearer(token)).expect(403);

            const list = async () => (await http.get('/moderation/company-requests').query({ pageSize: 100 }).set(bearer(admin)).expect(200)).body.data;
            const item = (await list()).find((r: { correo: string | null }) => r.correo === correo);
            expect(item).toMatchObject({ tipo: 'revision_resena', estado: 'pendiente', nombre: 'Persona Ficticia', empresa: { id: empresa }, resena: { id, publicada: true, loBueno: GOOD } });

            await http.patch(`/moderation/company-requests/${item.id}/answer`).set(bearer(admin)).send({ respuesta: 'corta' }).expect(400);
            const respuesta = 'Revisamos la reseña con nuestra política: no incumple las reglas, así que sigue publicada.';
            await http.patch(`/moderation/company-requests/${item.id}/answer`).set(bearer(admin)).send({ respuesta }).expect(204);
            const answered = (await list()).find((r: { id: number }) => r.id === item.id);
            expect(answered).toMatchObject({ estado: 'respondida', nombre: null, correo: null, respuesta });
            await http.patch(`/moderation/company-requests/${item.id}/answer`).set(bearer(admin)).send({ respuesta }).expect(409);
            await http.patch('/moderation/company-requests/999999/answer').set(bearer(admin)).send({ respuesta }).expect(404);
        });
    });
});
