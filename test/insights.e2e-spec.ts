import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestApp, unique, uniqueEmail } from './setup/helpers';

// Panel de indicadores (3.6). Las reseñas se insertan ya publicadas, como en directory.e2e-spec.ts. Otras suites dejan
// datos en la misma base: los totales se comparan contra una medición previa y los criterios se buscan por código.

const TEXT = 'Texto ficticio de prueba con más de cincuenta caracteres para cumplir el mínimo.';
type Answer = 'si' | 'en_parte' | 'no' | 'no_sabe';

interface Indicator { resenas: number; si: number; enParte: number; no: number; noSabe: number; porcentajeSi: number }
interface Insights {
    resenas: number;
    empresas: number;
    promedio: number | null;
    minimo: number;
    categorias: { codigo: string; nombre: string; indicador: Indicator | null; criterios: { codigo: string; texto: string; indicador: Indicator | null }[] }[];
}

describe('Panel de indicadores (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let db: DataSource;
    let city: number, otherCity: number, department: number, job: number, contract: number, mode: number;
    let category: { codigo: string; items: { id: number; codigo: string }[] };
    let inactiveItem: { id: number; codigo: string };
    const office: Record<string, number> = {};

    const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id as number;
    const insights = async (query: Record<string, unknown>): Promise<Insights> => (await http.get('/insights').query(query).expect(200)).body;
    const ours = (body: Insights) => body.categorias.find(c => c.codigo === category.codigo)!;

    async function createOffice(key: string, ciiu: string, cityId: number, estado = 'aprobada') {
        const company = await one(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT id FROM rubros WHERE codigo_ciiu = $2), $3) RETURNING id`, [unique(`Panel ${key}`), ciiu, estado]);
        office[key] = await one(`INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, $2, $3, 'aprobada') RETURNING id`, [company, cityId, unique(key)]);
    }

    /** Respuestas en orden: primer ítem, segundo ítem y el ítem inactivo. */
    async function createReview(local: string, rating: number, answers: Answer[], estado = 'publicada') {
        const user = await one(`INSERT INTO usuarios (email, hash_contrasena, fecha_consentimiento) VALUES ($1, 'x', now()) RETURNING id`, [uniqueEmail()]);
        const review = await one('INSERT INTO resenas (id_usuario, id_sucursal) VALUES ($1, $2) RETURNING id', [user, office[local]]);
        const version = await one(
            `INSERT INTO versiones_resena (id_resena, numero, id_cargo, situacion, ultimo_anio, id_tipo_contrato, id_modalidad, calificacion, lo_bueno, a_mejorar, estado, fecha_decision)
             VALUES ($1, 1, $2, 'anterior', 2025, $3, $4, $5, $6, $6, $7, now()) RETURNING id`,
            [review, job, contract, mode, rating, TEXT, estado]);
        if (estado === 'publicada') await db.query('UPDATE resenas SET id_version_publicada = $2 WHERE id = $1', [review, version]);
        const items = [...category.items, inactiveItem];
        for (const [i, answer] of answers.entries()) {
            await db.query('INSERT INTO respuestas_criterio (id_version, id_item, respuesta) VALUES ($1, $2, $3)', [version, items[i].id, answer]);
        }
    }

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
        db = app.get(DataSource);
        // Una ciudad que otras suites no usan para reseñas: la última del departamento con más distritos.
        department = await one('SELECT id_departamento AS id FROM ciudades GROUP BY id_departamento ORDER BY count(*) DESC, 1 LIMIT 1');
        [city, otherCity] = (await db.query('SELECT id FROM ciudades WHERE id_departamento = $1 ORDER BY id DESC LIMIT 2', [department])).map((r: { id: number }) => r.id);
        job = await one(`SELECT min(id) AS id FROM cargos WHERE estado = 'aprobada'`);
        contract = await one('SELECT min(id) AS id FROM tipo_contrato');
        mode = await one('SELECT min(id) AS id FROM modalidades');

        const codigo = unique('PANEL');
        const idCategoria = await one('INSERT INTO categorias (codigo, descripcion, orden) VALUES ($1, $2, -2000) RETURNING id', [codigo, unique('Categoría ficticia')]);
        const item = async (n: number, activo = true) => {
            const itemCode = unique('PI');
            const id = await one('INSERT INTO items (codigo, descripcion, id_categoria, orden, activo) VALUES ($1, $2, $3, $4, $5) RETURNING id', [itemCode, unique('Ítem'), idCategoria, n, activo]);
            return { id, codigo: itemCode };
        };
        category = { codigo, items: [await item(1), await item(2)] };
        inactiveItem = await item(3, false);

        await createOffice('comercio', 'G', city);
        await createOffice('obra', 'F', city);
        await createOffice('pendiente', 'G', city, 'pendiente');
        await createOffice('lejos', 'G', otherCity);
    });
    afterAll(() => app.close());

    it('lista todos los criterios activos, sin valores, aunque no haya reseñas', async () => {
        const body = await insights({ ciudad: city });
        expect(body.minimo).toBe(3);
        const cat = ours(body);
        expect(cat.indicador).toBeNull();
        expect(cat.criterios.map(c => c.codigo)).toEqual(category.items.map(i => i.codigo));
        expect(cat.criterios.every(c => c.indicador === null)).toBe(true);
    });

    it('con 2 reseñas no muestra valores ni promedio', async () => {
        const before = await insights({ ciudad: city });
        await createReview('comercio', 5, ['si', 'si', 'si']);
        await createReview('obra', 4, ['si', 'no', 'si']);
        const body = await insights({ ciudad: city });
        expect(body.resenas - before.resenas).toBe(2);
        expect(ours(body).indicador).toBeNull();
        expect(ours(body).criterios.every(c => c.indicador === null)).toBe(true);
    });

    it('desde 3 reseñas cuenta las respuestas y deja «No sé» fuera del porcentaje', async () => {
        await createReview('comercio', 3, ['en_parte', 'no_sabe', 'si']);
        const body = await insights({ ciudad: city });
        const [first, second] = ours(body).criterios;
        expect(first.indicador).toEqual({ resenas: 3, si: 2, enParte: 1, no: 0, noSabe: 0, porcentajeSi: 67 });
        // El segundo criterio tiene solo 2 reseñas que no respondieron «No sé»: no se muestra.
        expect(second.indicador).toBeNull();
        // Categoría: 6 respuestas (3 Sí, 1 En parte, 1 No y 1 No sé); el ítem inactivo no cuenta.
        expect(ours(body).indicador).toEqual({ resenas: 3, si: 3, enParte: 1, no: 1, noSabe: 1, porcentajeSi: 60 });
        expect(body.promedio).not.toBeNull();
    });

    it('no cuenta reseñas sin publicar ni de locales o empresas sin aprobar', async () => {
        const before = ours(await insights({ ciudad: city })).indicador;
        await createReview('comercio', 1, ['no', 'no'], 'en_revision');
        await createReview('comercio', 1, ['no', 'no'], 'rechazada');
        await createReview('pendiente', 1, ['no', 'no']);
        expect(ours(await insights({ ciudad: city })).indicador).toEqual(before);
    });

    it('filtra por rubro, grupo, departamento y ciudad del local', async () => {
        const commerce = ours(await insights({ ciudad: city, grupo: 'comercio' }));
        expect(commerce.criterios[0].indicador).toBeNull(); // 2 reseñas de comercio en la ciudad
        await createReview('lejos', 2, ['no', 'no']);
        const inDepartment = ours(await insights({ departamento: department, grupo: 'comercio' }));
        expect(inDepartment.criterios[0].indicador).toEqual({ resenas: 3, si: 1, enParte: 1, no: 1, noSabe: 0, porcentajeSi: 33 });
        const construction = await insights({ ciudad: city, rubro: await one(`SELECT id FROM rubros WHERE codigo_ciiu = 'F'`) });
        expect(construction.resenas).toBe(1);
        expect(construction.promedio).toBeNull();
    });

    it('nunca devuelve datos de la persona ni de la empresa', async () => {
        const text = JSON.stringify(await insights({ ciudad: city }));
        // «empresas» es solo el total de empresas con reseñas; ningún campo identifica una.
        expect(text).not.toMatch(/usuario|email|correo|id_?resena|id_?empresa|"empresa"|sucursal|local/i);
    });

    it('rechaza filtros inválidos o desconocidos', async () => {
        await http.get('/insights').query({ grupo: 'otro' }).expect(400);
        await http.get('/insights').query({ ciudad: 0 }).expect(400);
        await http.get('/insights').query({ q: 'algo' }).expect(400);
    });
});
