import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { adminToken, bearer, createTestApp, unique, userToken } from './setup/helpers';

// Los datos de referencia vienen de la migración base (INE 2022, CIIU Rev. 4, R5).
describe('Catálogos (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
    });
    afterAll(() => app.close());

    it('son públicos y paginan con el formato { data, total, page, pageSize }', async () => {
        const { body } = await http.get('/departments').query({ page: 1, pageSize: 5 }).expect(200);
        expect(body).toMatchObject({ total: 18, page: 1, pageSize: 5 });
        expect(body.data).toHaveLength(5);
    });

    it('validan la paginación', async () => {
        await http.get('/cities').query({ pageSize: 101 }).expect(400);
        await http.get('/cities').query({ page: 0 }).expect(400);
    });

    it('traen los 18 departamentos y los 263 distritos del INE', async () => {
        expect((await http.get('/departments').expect(200)).body.total).toBe(18);
        expect((await http.get('/cities').expect(200)).body.total).toBe(263);
    });

    it('filtran las ciudades por departamento', async () => {
        const departments = (await http.get('/departments').query({ pageSize: 100 }).expect(200)).body.data;
        const central = departments.find((d: { nombre: string }) => d.nombre === 'Central');
        const { body } = await http.get('/cities').query({ departamento: central.id, pageSize: 100 }).expect(200);
        expect(body.total).toBe(19);
        expect(body.data.every((c: { idDepartamento: number }) => c.idDepartamento === central.id)).toBe(true);
    });

    it('traen los rubros CIIU, los tipos de contrato y las modalidades', async () => {
        expect((await http.get('/sectors').expect(200)).body.total).toBe(21);
        const contracts = (await http.get('/contract-types').expect(200)).body.data.map((c: { nombre: string }) => c.nombre);
        expect(contracts).toEqual(expect.arrayContaining(['Por tiempo indefinido', 'Sin contrato escrito']));
        const modes = (await http.get('/work-modes').expect(200)).body.data.map((m: { nombre: string }) => m.nombre);
        expect(modes).toEqual(expect.arrayContaining(['Presencial', 'Remota', 'Híbrida']));
    });

    it('responden 404 a un id que no existe y 400 a uno que no es número', async () => {
        await http.get('/cities/999999').expect(404);
        await http.get('/cities/abc').expect(400);
    });

    describe('Cargos', () => {
        it('solo el administrador crea y elimina cargos', async () => {
            const descripcion = unique('Cajera');
            await http.post('/jobs').send({ descripcion }).expect(401);
            const { token } = await userToken(app);
            await http.post('/jobs').set(bearer(token)).send({ descripcion }).expect(403);

            const admin = await adminToken(app);
            const created = await http.post('/jobs').set(bearer(admin)).send({ descripcion }).expect(201);
            const list = (await http.get('/jobs').query({ pageSize: 100 }).expect(200)).body.data;
            expect(list.map((j: { descripcion: string }) => j.descripcion)).toContain(descripcion);

            await http.delete(`/jobs/${created.body.id}`).set(bearer(admin)).expect(204);
            await http.get(`/jobs/${created.body.id}`).expect(404);
        });
    });
});
