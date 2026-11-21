import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource, QueryFailedError } from 'typeorm';
import { createTestApp, unique, userToken } from './setup/helpers';

// Tarea 3.2: las reglas de la reseña las hace cumplir la base, no solo el código (la 3.3 agrega el módulo).
const TEXT = 'Pagan en fecha y el ambiente es bueno, con contrato y con IPS desde el primer día.';

describe('Modelo de datos de la reseña (e2e)', () => {
    let app: INestApplication;
    let db: DataSource;
    let ref: { cargo: number; contrato: number; modalidad: number; item: number; sucursal: number };

    /** Código de error de PostgreSQL de una consulta que debería fallar. */
    async function pgError(sql: string, params: unknown[] = []): Promise<string> {
        try {
            await db.query(sql, params);
            return 'sin error';
        } catch (error) {
            return error instanceof QueryFailedError ? (error.driverError as { code: string }).code : 'otro error';
        }
    }

    async function newReview(idUsuario: number, idSucursal = ref.sucursal): Promise<number> {
        const [{ id }] = await db.query('INSERT INTO resenas (id_usuario, id_sucursal) VALUES ($1, $2) RETURNING id', [idUsuario, idSucursal]);
        return id;
    }

    async function newVersion(idResena: number, overrides: Record<string, unknown> = {}): Promise<number> {
        const v = { numero: 1, situacion: 'anterior', ultimo_anio: 2025, calificacion: 4, lo_bueno: TEXT, a_mejorar: TEXT, ...overrides };
        const [{ id }] = await db.query(
            `INSERT INTO versiones_resena (id_resena, numero, id_cargo, situacion, ultimo_anio, id_tipo_contrato, id_modalidad, calificacion, lo_bueno, a_mejorar)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [idResena, v.numero, ref.cargo, v.situacion, v.ultimo_anio, ref.contrato, ref.modalidad, v.calificacion, v.lo_bueno, v.a_mejorar]);
        return id;
    }

    beforeAll(async () => {
        app = await createTestApp();
        db = app.get(DataSource);
        const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id;
        const [empresa] = await db.query(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT min(id) FROM rubros), 'aprobada') RETURNING id`, [unique('Empresa Ficticia')]);
        const categoria = await one('INSERT INTO categorias (codigo, descripcion) VALUES ($1, $2) RETURNING id', [unique('CAT'), unique('Categoría de prueba')]);
        ref = {
            cargo: await one('SELECT min(id) AS id FROM cargos'),
            contrato: await one('SELECT min(id) AS id FROM tipo_contrato'),
            modalidad: await one('SELECT min(id) AS id FROM modalidades'),
            item: await one('INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, 1) RETURNING id',
                [unique('IT'), unique('Ítem de prueba'), categoria]),
            sucursal: await one(`INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, (SELECT min(id) FROM ciudades), 'Casa central', 'aprobada') RETURNING id`, [empresa.id]),
        };
    });
    afterAll(() => app.close());

    it('guarda una reseña con su versión y sus respuestas, y publica esa versión', async () => {
        const { id: usuario } = await userToken(app);
        const resena = await newReview(usuario);
        const version = await newVersion(resena);
        await db.query(`INSERT INTO respuestas_criterio (id_version, id_item, respuesta) VALUES ($1, $2, 'en_parte')`, [version, ref.item]);
        await db.query(`UPDATE versiones_resena SET estado = 'publicada' WHERE id = $1`, [version]);
        await db.query('UPDATE resenas SET id_version_publicada = $1 WHERE id = $2', [version, resena]);
        const [row] = await db.query('SELECT id_version_publicada FROM resenas WHERE id = $1', [resena]);
        expect(row.id_version_publicada).toBe(version);
    });

    it('una reseña por persona y local, sin contar las eliminadas', async () => {
        const { id: usuario } = await userToken(app);
        const first = await newReview(usuario);
        expect(await pgError('INSERT INTO resenas (id_usuario, id_sucursal) VALUES ($1, $2)', [usuario, ref.sucursal])).toBe('23505');
        await db.query('UPDATE resenas SET eliminada = true WHERE id = $1', [first]);
        await expect(newReview(usuario)).resolves.toBeGreaterThan(first);
    });

    it('rechaza textos fuera de 50 a 1.000 caracteres, sin contar espacios de los extremos', async () => {
        const resena = await newReview((await userToken(app)).id);
        await expect(newVersion(resena, { lo_bueno: 'a'.repeat(49) })).rejects.toThrow(/CK_versiones_resena_lo_bueno/);
        await expect(newVersion(resena, { a_mejorar: `   ${'a'.repeat(49)}   ` })).rejects.toThrow(/CK_versiones_resena_a_mejorar/);
        await expect(newVersion(resena, { lo_bueno: 'a'.repeat(1001) })).rejects.toThrow(/CK_versiones_resena_lo_bueno/);
    });

    it('calificación de 1 a 5 y solo el año, solo si ya no trabaja ahí', async () => {
        const resena = await newReview((await userToken(app)).id);
        await expect(newVersion(resena, { calificacion: 6 })).rejects.toThrow(/CK_versiones_resena_calificacion/);
        await expect(newVersion(resena, { situacion: 'actual', ultimo_anio: 2025 })).rejects.toThrow(/CK_versiones_resena_ultimo_anio/);
        await expect(newVersion(resena, { situacion: 'anterior', ultimo_anio: null })).rejects.toThrow(/CK_versiones_resena_ultimo_anio/);
        await expect(newVersion(resena, { situacion: 'actual', ultimo_anio: null })).resolves.toBeGreaterThan(0);
    });

    it('la versión publicada tiene que ser de la misma reseña', async () => {
        const a = await newReview((await userToken(app)).id);
        const b = await newReview((await userToken(app)).id);
        const versionOfB = await newVersion(b);
        expect(await pgError('UPDATE resenas SET id_version_publicada = $1 WHERE id = $2', [versionOfB, a])).toBe('23503');
    });

    it('solo acepta las cuatro respuestas de la forma de la reseña (R2)', async () => {
        const version = await newVersion(await newReview((await userToken(app)).id));
        expect(await pgError(`INSERT INTO respuestas_criterio (id_version, id_item, respuesta) VALUES ($1, $2, 'tal_vez')`, [version, ref.item])).toBe('22P02');
    });

    it('al eliminar la cuenta se eliminan sus reseñas (D9) y la decisión de moderación queda anónima', async () => {
        const { id: usuario } = await userToken(app);
        const resena = await newReview(usuario);
        const version = await newVersion(resena);
        await db.query(`INSERT INTO respuestas_criterio (id_version, id_item, respuesta) VALUES ($1, $2, 'si')`, [version, ref.item]);
        const [decision] = await db.query(
            `INSERT INTO decisiones_moderacion (id_resena, id_version_resena, huella_texto, resultado, origen) VALUES ($1, $2, $3, 'publicada', 'modelo') RETURNING id`,
            [resena, version, 'f'.repeat(64)]);

        await db.query('DELETE FROM usuarios WHERE id = $1', [usuario]);

        expect(await db.query('SELECT 1 FROM resenas WHERE id = $1', [resena])).toHaveLength(0);
        expect(await db.query('SELECT 1 FROM respuestas_criterio WHERE id_version = $1', [version])).toHaveLength(0);
        const [kept] = await db.query('SELECT id_resena, id_version_resena, huella_texto FROM decisiones_moderacion WHERE id = $1', [decision.id]);
        expect(kept).toEqual({ id_resena: null, id_version_resena: null, huella_texto: 'f'.repeat(64) });
    });

    it('un cargo propuesto (pendiente) no aparece en la lista pública de cargos', async () => {
        const descripcion = unique('Cargo propuesto');
        const [cargo] = await db.query(`INSERT INTO cargos (descripcion, estado) VALUES ($1, 'pendiente') RETURNING id`, [descripcion]);
        const { body } = await request(app.getHttpServer()).get('/jobs').query({ pageSize: 100 }).expect(200);
        expect(body.data.map((j: { descripcion: string }) => j.descripcion)).not.toContain(descripcion);
        await request(app.getHttpServer()).get(`/jobs/${cargo.id}`).expect(404);
    });
});
