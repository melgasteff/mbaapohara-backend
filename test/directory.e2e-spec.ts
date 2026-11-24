import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { createTestApp, unique, uniqueEmail } from './setup/helpers';

// Rediseño, fase 2: resumen, facetas y orden del directorio y del perfil. Las reseñas se insertan ya publicadas: el
// recorrido de publicación y moderación se prueba en reviews.e2e-spec.ts.

const TEXT = 'Texto ficticio de prueba con más de cincuenta caracteres para cumplir el mínimo.';
type Answer = 'si' | 'en_parte' | 'no' | 'no_sabe';

describe('Directorio y perfil con reseñas (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let db: DataSource;
    /** Marca única: todas las empresas de la suite la llevan en el nombre, y los filtros la usan como `q`. */
    const mark = unique('Directorio');
    let depA: number, depB: number, cityA: number, cityA2: number, cityB: number;
    let catFirst: { id: number; codigo: string; items: number[] };
    let catSecond: { id: number; codigo: string; items: number[] };
    const company: Record<string, number> = {};
    const office: Record<string, number> = {};
    let pendingJob: number;
    let job: number;
    const refs = { contracts: [] as number[], modes: [] as number[] };

    const one = async (sql: string, params: unknown[] = []) => (await db.query(sql, params))[0].id as number;
    const get = async (path: string, query: Record<string, unknown> = {}) => (await http.get(path).query(query).expect(200)).body;
    const names = async (query: Record<string, unknown> = {}) =>
        (await get('/companies', { q: mark, pageSize: 100, ...query })).data.map((c: { nombre: string }) => c.nombre.replace(`${mark} `, ''));

    async function createCompany(key: string, ciiu: string, offices: Record<string, number>, estado = 'aprobada') {
        company[key] = await one(`INSERT INTO empresas (nombre, id_rubro, estado) VALUES ($1, (SELECT id FROM rubros WHERE codigo_ciiu = $2), $3) RETURNING id`, [`${mark} ${key}`, ciiu, estado]);
        for (const [name, city] of Object.entries(offices)) {
            office[name] = await one(`INSERT INTO sucursales (id_empresa, id_ciudad, nombre, estado) VALUES ($1, $2, $3, 'aprobada') RETURNING id`, [company[key], city, name]);
        }
    }

    async function createReview(local: string, rating: number, answers: Answer[] = [], options: { estado?: string; jobId?: number; situacion?: 'actual' | 'anterior'; contract?: number; daysAgo?: number } = {}) {
        const user = await one(`INSERT INTO usuarios (email, hash_contrasena, fecha_consentimiento) VALUES ($1, 'x', now()) RETURNING id`, [uniqueEmail()]);
        const review = await one('INSERT INTO resenas (id_usuario, id_sucursal) VALUES ($1, $2) RETURNING id', [user, office[local]]);
        const estado = options.estado ?? 'publicada';
        const situacion = options.situacion ?? 'anterior';
        const version = await one(
            `INSERT INTO versiones_resena (id_resena, numero, id_cargo, situacion, ultimo_anio, id_tipo_contrato, id_modalidad, calificacion, lo_bueno, a_mejorar, estado, fecha_decision)
             VALUES ($1, 1, $2, $3, $4, $5, $6, $7, $8, $8, $9, now() - make_interval(days => $10)) RETURNING id`,
            [review, options.jobId ?? job, situacion, situacion === 'anterior' ? 2025 : null, options.contract ?? refs.contracts[0], refs.modes[0], rating, TEXT, estado, options.daysAgo ?? 0]);
        if (estado === 'publicada') await db.query('UPDATE resenas SET id_version_publicada = $2 WHERE id = $1', [review, version]);
        const items = [...catFirst.items, ...catSecond.items];
        for (const [i, answer] of answers.entries()) {
            await db.query('INSERT INTO respuestas_criterio (id_version, id_item, respuesta) VALUES ($1, $2, $3)', [version, items[i], answer]);
        }
        return review;
    }

    async function createCategory(order: number) {
        const codigo = unique('CAT');
        const id = await one('INSERT INTO categorias (codigo, descripcion, orden) VALUES ($1, $2, $3) RETURNING id', [codigo, unique('Categoría ficticia'), order]);
        const items: number[] = [];
        for (const n of [1, 2]) items.push(await one('INSERT INTO items (codigo, descripcion, id_categoria, orden) VALUES ($1, $2, $3, $4) RETURNING id', [unique('IT'), unique('Ítem'), id, n]));
        return { id, codigo, items };
    }

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
        db = app.get(DataSource);
        [depA, depB] = (await db.query('SELECT id_departamento AS id FROM ciudades GROUP BY id_departamento HAVING count(*) >= 2 ORDER BY 1 LIMIT 2')).map((r: { id: number }) => r.id);
        [cityA, cityA2] = (await db.query('SELECT id FROM ciudades WHERE id_departamento = $1 ORDER BY id LIMIT 2', [depA])).map((r: { id: number }) => r.id);
        cityB = await one('SELECT min(id) AS id FROM ciudades WHERE id_departamento = $1', [depB]);
        job = await one(`SELECT min(id) AS id FROM cargos WHERE estado = 'aprobada'`);
        pendingJob = await one(`INSERT INTO cargos (descripcion, estado) VALUES ($1, 'pendiente') RETURNING id`, [unique('Cargo sin aprobar')]);
        refs.contracts = (await db.query('SELECT id FROM tipo_contrato ORDER BY id')).map((r: { id: number }) => r.id);
        refs.modes = (await db.query('SELECT id FROM modalidades ORDER BY id')).map((r: { id: number }) => r.id);
        // Orden negativo: van antes que los criterios que hayan creado otras suites.
        catFirst = await createCategory(-1000);
        catSecond = await createCategory(-999);

        await createCompany('Alfa', 'G', { 'Alfa centro': cityA, 'Alfa norte': cityB });
        await createCompany('Beta', 'F', { 'Beta centro': cityA2 });
        await createCompany('Gama', 'K', { 'Gama centro': cityB });
        await createCompany('Delta', 'S', { 'Delta centro': cityB });
        await createCompany('Oculta', 'G', { 'Oculta centro': cityA }, 'pendiente');

        // Alfa: 4 publicadas (4, 4, 3, 2: promedio 3,25). Primera categoría: 3 reseñas la responden; segunda: solo 2.
        await createReview('Alfa centro', 4, ['si', 'si', 'si', 'no_sabe'], { daysAgo: 4 });
        await createReview('Alfa centro', 4, ['si', 'no', 'no', 'no'], { daysAgo: 3, situacion: 'actual' });
        await createReview('Alfa centro', 3, ['en_parte', 'no_sabe', 'no_sabe', 'no_sabe'], { daysAgo: 2, jobId: pendingJob });
        await createReview('Alfa norte', 2, ['no_sabe', 'no_sabe', 'no_sabe', 'no_sabe'], { daysAgo: 1, contract: refs.contracts[1] });
        // No cuentan: en revisión y rechazada.
        await createReview('Alfa centro', 1, ['no', 'no', 'no', 'no'], { estado: 'en_revision' });
        await createReview('Alfa centro', 1, ['no', 'no', 'no', 'no'], { estado: 'rechazada' });
        // Beta: 2 publicadas de 5. Gama: ninguna. Delta: 3 de 5.
        await createReview('Beta centro', 5, ['si', 'si', 'si', 'si']);
        await createReview('Beta centro', 5, ['si', 'si', 'si', 'si']);
        for (let i = 0; i < 3; i++) await createReview('Delta centro', 5, ['si', 'si', 'si', 'si']);
        // Una empresa sin aprobar nunca cuenta, aunque tenga una reseña publicada.
        await createReview('Oculta centro', 5);
    });
    afterAll(async () => {
        await db.query('UPDATE categorias SET activo = false WHERE id = ANY($1)', [[catFirst.id, catSecond.id]]);
        await app.close();
    });

    describe('GET /companies', () => {
        const find = async (key: string) => (await get('/companies', { q: `${mark} ${key}` })).data[0];

        it('sin reseñas: cantidad 0, sin promedio ni tema', async () => {
            expect(await find('Gama')).toMatchObject({ cantidadResenas: 0, promedio: null, temaPrincipal: null, logoUrl: null, rubro: { grupo: 'servicios' } });
        });

        it('con 2: promedio sí, tema no', async () => {
            expect(await find('Beta')).toMatchObject({ cantidadResenas: 2, promedio: 5, temaPrincipal: null, rubro: { grupo: 'industria' } });
        });

        it('con 3 o más: promedio con un decimal y % de «Sí» de la primera categoría, sin contar «No sé»', async () => {
            const alfa = await find('Alfa');
            expect(alfa).toMatchObject({ cantidadResenas: 4, promedio: 3.3, rubro: { grupo: 'comercio' } });
            // «Sí» 3 de 5 respuestas (si, si, si, no, en_parte).
            expect(alfa.temaPrincipal).toMatchObject({ codigo: catFirst.codigo, porcentajeSi: 60, resenas: 3 });
        });

        it('filtra por grupo, departamento, ciudad y con o sin reseñas', async () => {
            expect(await names({ grupo: 'comercio' })).toEqual(['Alfa']);
            expect(await names({ grupo: 'agro-otros' })).toEqual(['Delta']);
            expect(await names({ departamento: depA })).toEqual(['Alfa', 'Beta']);
            expect(await names({ departamento: depB })).toEqual(['Alfa', 'Delta', 'Gama']);
            expect(await names({ ciudad: cityA2 })).toEqual(['Beta']);
            expect(await names({ conResenas: true })).toEqual(['Alfa', 'Beta', 'Delta']);
            expect(await names({ conResenas: false })).toEqual(['Gama']);
            expect(await names({ departamento: depB, grupo: 'servicios', conResenas: false })).toEqual(['Gama']);
        });

        it('ordena por nombre, por reseñas y por calificación (las de menos de 3 reseñas, después)', async () => {
            expect(await names()).toEqual(['Alfa', 'Beta', 'Delta', 'Gama']);
            expect(await names({ orden: 'resenas' })).toEqual(['Alfa', 'Delta', 'Beta', 'Gama']);
            expect(await names({ orden: 'calificacion' })).toEqual(['Delta', 'Alfa', 'Beta', 'Gama']);
        });

        it('busca también por el nombre de un local aprobado y por el rubro, sin tildes ni mayúsculas', async () => {
            const found = async (q: string) => (await get('/companies', { q, pageSize: 100 })).data.map((c: { id: number }) => c.id);
            expect(await found('ALFA NORTE')).toContain(company.Alfa);
            expect(await found('construccion')).toContain(company.Beta);
            expect(await found('construccion')).not.toContain(company.Gama);
            await db.query(`UPDATE sucursales SET estado = 'pendiente' WHERE id = $1`, [office['Gama centro']]);
            expect(await found('gama centro')).not.toContain(company.Gama);
            await db.query(`UPDATE sucursales SET estado = 'aprobada' WHERE id = $1`, [office['Gama centro']]);
        });

        it('pagina y valida los filtros', async () => {
            const page = await get('/companies', { q: mark, pageSize: 2, page: 2 });
            expect(page).toMatchObject({ total: 4, page: 2, pageSize: 2 });
            expect(page.data).toHaveLength(2);
            for (const query of [{ grupo: 'otro' }, { conResenas: 'quizás' }, { orden: 'x' }, { departamento: 'abc' }]) {
                await http.get('/companies').query(query).expect(400);
            }
        });
    });

    describe('GET /companies/facets', () => {
        it('cada conteo aplica los demás filtros y no el propio', async () => {
            const all = await get('/companies/facets', { q: mark });
            expect(all).toMatchObject({ total: 4, experiencias: 9, resenas: { total: 4, con: 3, sin: 1 } });
            expect(all.grupos.total).toBe(4);
            expect(Object.fromEntries(all.grupos.opciones.map((o: { grupo: string; cantidad: number }) => [o.grupo, o.cantidad])))
                .toEqual({ comercio: 1, industria: 1, servicios: 1, gastronomia: 0, transporte: 0, 'agro-otros': 1 });

            const filtered = await get('/companies/facets', { q: mark, departamento: depB, conResenas: true });
            expect(filtered.total).toBe(2);
            expect(filtered.resenas).toEqual({ total: 3, con: 2, sin: 1 });
            expect(filtered.departamentos.total).toBe(3);
            const count = (id: number) => filtered.departamentos.opciones.find((o: { id: number }) => o.id === id)?.cantidad;
            // Alfa tiene locales en los dos departamentos: cuenta en ambos.
            expect([count(depA), count(depB)]).toEqual([2, 2]);
        });

        it('las experiencias y las ciudades se limitan al lugar elegido', async () => {
            const b = await get('/companies/facets', { q: mark, departamento: depB });
            expect(b.experiencias).toBe(4);
            expect(b.ciudades.opciones.map((o: { id: number; cantidad: number }) => [o.id, o.cantidad])).toEqual([[cityB, 3]]);
            const a = await get('/companies/facets', { q: mark, ciudad: cityA });
            expect(a).toMatchObject({ total: 1, experiencias: 3 });
            // Elegir una ciudad no achica la lista de ciudades ni la de departamentos.
            expect(a.ciudades.total).toBe(4);
            expect(a.departamentos.total).toBe(4);
        });

        it('sin resultados devuelve ceros', async () => {
            expect(await get('/companies/facets', { q: unique('nada') })).toMatchObject({ total: 0, experiencias: 0, resenas: { total: 0, con: 0, sin: 0 } });
        });
    });

    describe('GET /companies/:id', () => {
        it('con 3 o más: distribución, temas con 3 reseñas o más y reseñas por local', async () => {
            const alfa = await get(`/companies/${company.Alfa}`);
            expect(alfa).toMatchObject({ cantidadResenas: 4, promedio: 3.3 });
            expect(alfa.distribucion).toEqual([5, 4, 3, 2, 1].map((estrellas, i) => ({ estrellas, cantidad: [0, 2, 1, 1, 0][i] })));
            // La segunda categoría solo la respondieron 2 reseñas sin «No sé»: no se muestra.
            expect(alfa.temas.map((t: { codigo: string }) => t.codigo)).toEqual([catFirst.codigo]);
            expect(alfa.locales.map((l: { nombre: string; cantidadResenas: number }) => [l.nombre, l.cantidadResenas])).toEqual([['Alfa centro', 3], ['Alfa norte', 1]]);
        });

        it('los temas salen en el orden de administración', async () => {
            const delta = await get(`/companies/${company.Delta}`);
            expect(delta.temas.map((t: { codigo: string; porcentajeSi: number }) => [t.codigo, t.porcentajeSi])).toEqual([[catFirst.codigo, 100], [catSecond.codigo, 100]]);
        });

        it('con 1 o 2 reseñas, distribución y temas vacíos; sin reseñas, también sin promedio', async () => {
            expect(await get(`/companies/${company.Beta}`)).toMatchObject({ cantidadResenas: 2, promedio: 5, distribucion: [], temas: [], temaPrincipal: null });
            expect(await get(`/companies/${company.Gama}`)).toMatchObject({ cantidadResenas: 0, promedio: null, distribucion: [], temas: [] });
        });

        it('una empresa sin aprobar sigue sin existir para el público', () => http.get(`/companies/${company.Oculta}`).expect(404));
    });

    describe('GET /reviews', () => {
        const ratings = async (orden?: string) =>
            (await get('/reviews', { empresa: company.Alfa, ...(orden ? { orden } : {}) })).data.map((r: { calificacion: number }) => r.calificacion);

        it('ordena por recientes (por defecto), mejor y peor', async () => {
            expect(await ratings()).toEqual([2, 3, 4, 4]);
            expect(await ratings('mejor')).toEqual([4, 4, 3, 2]);
            expect(await ratings('peor')).toEqual([2, 3, 4, 4]);
            await http.get('/reviews').query({ orden: 'x' }).expect(400);
        });

        it('cuenta por opción de cada filtro, aplicando los demás', async () => {
            const facets = await get('/reviews/facets', { empresa: company.Alfa });
            expect(facets.total).toBe(4);
            expect(facets.local).toMatchObject({ total: 4 });
            expect(facets.local.opciones.map((o: { id: number; cantidad: number }) => [o.id, o.cantidad]).sort()).toEqual([[office['Alfa centro'], 3], [office['Alfa norte'], 1]].sort());
            expect(facets.situacion.opciones).toEqual(expect.arrayContaining([{ valor: 'ACTUAL', cantidad: 1 }, { valor: 'ANTERIOR', cantidad: 3 }]));

            const filtered = await get('/reviews/facets', { empresa: company.Alfa, local: office['Alfa centro'], situacion: 'ANTERIOR' });
            expect(filtered.total).toBe(2);
            expect(filtered.local.total).toBe(3);
            expect(filtered.situacion.total).toBe(3);
            expect(filtered.tipoContrato.opciones.map((o: { id: number; cantidad: number }) => [o.id, o.cantidad])).toEqual([[refs.contracts[0], 2]]);
        });

        it('un cargo sin aprobar no aparece en los conteos', async () => {
            const { cargo } = await get('/reviews/facets', { empresa: company.Alfa });
            expect(cargo.total).toBe(4);
            expect(cargo.opciones).toEqual([expect.objectContaining({ id: job, cantidad: 3 })]);
        });

        it('los conteos exigen la empresa', () => http.get('/reviews/facets').expect(400));
    });

    it('nada de lo público lleva datos de la cuenta', async () => {
        const bodies = await Promise.all([
            get('/companies', { q: mark }), get('/companies/facets', { q: mark }), get(`/companies/${company.Alfa}`), get('/reviews/facets', { empresa: company.Alfa }),
        ]);
        expect(JSON.stringify(bodies)).not.toMatch(/usuario|email|@ejemplo|fecha/i);
    });
});
