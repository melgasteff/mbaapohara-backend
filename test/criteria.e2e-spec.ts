import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { adminToken, bearer, createTestApp, unique, userToken } from './setup/helpers';

// Tarea 3.8: administración de criterios (categorías e ítems). Se crean, editan y desactivan; no se borran.

let sequence = 0;
/** Código único con el formato que acepta la API (letras, números y guion bajo). */
const code = (prefix: string) => `${prefix}_${Date.now() % 1e8}_${sequence++}`;

type PublicCategory = { codigo: string; nombre: string; orden: number; items: { codigo: string; orden: number; texto: string }[] };

describe('Criterios (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let admin: Record<string, string>;
    const created: number[] = [];

    const publicCriteria = async (): Promise<PublicCategory[]> => (await http.get('/criteria').expect(200)).body;
    const createCategory = async (overrides: Record<string, unknown> = {}) => {
        const { body } = await http.post('/criteria/categories').set(admin)
            .send({ codigo: code('CAT'), nombre: unique('Categoría'), ...overrides }).expect(201);
        created.push(body.id);
        return body;
    };
    const createItem = async (idCategoria: number, overrides: Record<string, unknown> = {}) =>
        (await http.post('/criteria/items').set(admin)
            .send({ codigo: code('IT'), texto: unique('Me pagaron las horas extra'), idCategoria, ...overrides }).expect(201)).body;

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
        admin = bearer(await adminToken(app));
    });
    // Lo creado queda inactivo, para que las suites siguientes no tengan que responderlo.
    afterAll(async () => {
        for (const id of created) await http.patch(`/criteria/categories/${id}`).set(admin).send({ activo: false });
        await app.close();
    });

    it('la lista pública no pide sesión; la administración y los cambios son solo del administrador', async () => {
        await http.get('/criteria').expect(200);
        await http.get('/criteria/admin').expect(401);
        const { token } = await userToken(app);
        await http.get('/criteria/admin').set(bearer(token)).expect(403);
        await http.post('/criteria/categories').set(bearer(token)).send({ codigo: code('CAT'), nombre: unique('X') }).expect(403);
        await http.patch('/criteria/items/1').set(bearer(token)).send({ activo: false }).expect(403);
    });

    it('crea una categoría con sus ítems, al final y en orden, y la muestra en la lista pública', async () => {
        const category = await createCategory({ codigo: ` ${code('cat').toLowerCase()} ` });
        expect(category).toMatchObject({ activo: true, items: [] });
        expect(category.codigo).toMatch(/^CAT_/);

        const first = await createItem(category.id);
        const second = await createItem(category.id);
        expect(first).toMatchObject({ activo: true, orden: 1, respuestas: 0, idCategoria: category.id });
        expect(second.orden).toBe(2);

        const shown = (await publicCriteria()).find(c => c.codigo === category.codigo);
        expect(shown).toEqual({
            codigo: category.codigo, nombre: category.nombre, orden: category.orden,
            items: [first, second].map(i => ({ codigo: i.codigo, orden: i.orden, texto: i.texto })),
        });
    });

    it('una categoría sin ítems activos no aparece en la lista pública', async () => {
        const category = await createCategory();
        expect((await publicCriteria()).some(c => c.codigo === category.codigo)).toBe(false);
    });

    it('rechaza códigos, nombres y textos repetidos con un mensaje preciso', async () => {
        const category = await createCategory();
        const res1 = await http.post('/criteria/categories').set(admin).send({ codigo: category.codigo, nombre: unique('Otra') }).expect(409);
        expect(res1.body.message).toBe('Ya existe una categoría con ese código');
        const res2 = await http.post('/criteria/categories').set(admin).send({ codigo: code('CAT'), nombre: category.nombre.toUpperCase() }).expect(409);
        expect(res2.body.message).toBe('Ya existe una categoría con ese nombre');

        const item = await createItem(category.id);
        const res3 = await http.post('/criteria/items').set(admin).send({ codigo: item.codigo, texto: unique('Otro'), idCategoria: category.id }).expect(409);
        expect(res3.body.message).toBe('Ya existe un ítem con ese código');
        const res4 = await http.post('/criteria/items').set(admin).send({ codigo: code('IT'), texto: item.texto, idCategoria: category.id }).expect(409);
        expect(res4.body.message).toBe('Esa categoría ya tiene un ítem con ese texto');
    });

    it('valida el código, la categoría y que no se cambie el código', async () => {
        await http.post('/criteria/categories').set(admin).send({ codigo: 'CÓDIGO CON ESPACIOS', nombre: unique('X') }).expect(400);
        await http.post('/criteria/items').set(admin).send({ codigo: code('IT'), texto: unique('X'), idCategoria: 999999 }).expect(400);
        const category = await createCategory();
        const item = await createItem(category.id);
        await http.patch(`/criteria/items/${item.id}`).set(admin).send({ codigo: 'OTRO' }).expect(400);
        await http.patch(`/criteria/categories/${category.id}`).set(admin).send({ codigo: 'OTRO' }).expect(400);
        await http.patch('/criteria/items/999999').set(admin).send({ activo: false }).expect(404);
        await http.patch('/criteria/categories/999999').set(admin).send({ activo: false }).expect(404);
    });

    it('edita el texto y el orden, y desactivar oculta el ítem o la categoría sin borrarlos', async () => {
        const category = await createCategory();
        const first = await createItem(category.id);
        const second = await createItem(category.id);

        const texto = unique('Me pagaron el aguinaldo completo');
        const { body: edited } = await http.patch(`/criteria/items/${second.id}`).set(admin).send({ texto, orden: 0 }).expect(200);
        expect(edited).toMatchObject({ id: second.id, codigo: second.codigo, texto, orden: 0 });
        let shown = (await publicCriteria()).find(c => c.codigo === category.codigo)!;
        expect(shown.items.map(i => i.codigo)).toEqual([second.codigo, first.codigo]);

        await http.patch(`/criteria/items/${first.id}`).set(admin).send({ activo: false }).expect(200);
        shown = (await publicCriteria()).find(c => c.codigo === category.codigo)!;
        expect(shown.items.map(i => i.codigo)).toEqual([second.codigo]);

        const { body: hidden } = await http.patch(`/criteria/categories/${category.id}`).set(admin).send({ activo: false, nombre: unique('Renombrada') }).expect(200);
        expect(hidden.activo).toBe(false);
        expect((await publicCriteria()).some(c => c.codigo === category.codigo)).toBe(false);

        // La administración sigue viendo todo, con el estado de cada uno.
        const all = (await http.get('/criteria/admin').set(admin).expect(200)).body;
        const inAdmin = all.find((c: { id: number }) => c.id === category.id);
        expect(inAdmin.items.map((i: { id: number; activo: boolean }) => [i.id, i.activo])).toEqual([[second.id, true], [first.id, false]]);
    });

    it('no tiene ruta para borrar', async () => {
        const category = await createCategory();
        await http.delete(`/criteria/categories/${category.id}`).set(admin).expect(404);
    });
});
