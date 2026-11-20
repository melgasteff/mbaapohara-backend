import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { adminToken, bearer, createTestApp, unique, userToken } from './setup/helpers';

interface Ref { id: number; nombre: string }

describe('Empresas y locales (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;
    let user: string;
    let admin: string;
    let sector: Ref;
    let asuncion: Ref;
    let otherCity: Ref;

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
        user = (await userToken(app)).token;
        admin = await adminToken(app);
        sector = (await http.get('/sectors').expect(200)).body.data[0];
        const cities: Ref[] = (await http.get('/cities').query({ pageSize: 100 }).expect(200)).body.data;
        asuncion = cities.find((c) => c.nombre === 'Asunción')!;
        otherCity = cities.find((c) => c.id !== asuncion.id)!;
    });
    afterAll(() => app.close());

    /** Propone una empresa con su primer local (como usuario) y devuelve la empresa y el local. */
    async function propose(nombre = unique('Empresa Ficticia'), idCiudad = asuncion.id) {
        const company = (await http.post('/companies').set(bearer(user))
            .send({ nombre, idRubro: sector.id, local: { nombre: 'Casa central', idCiudad } }).expect(201)).body;
        const offices = (await http.get('/offices/admin').query({ empresa: company.id }).set(bearer(admin)).expect(200)).body.data;
        return { company, office: offices[0] };
    }

    async function approved(nombre?: string, idCiudad?: number) {
        const created = await propose(nombre, idCiudad);
        await http.patch(`/companies/${created.company.id}/approve`).set(bearer(admin)).expect(200);
        return created;
    }

    describe('Propuesta (D10)', () => {
        it('exige sesión iniciada', () =>
            http.post('/companies').send({ nombre: unique('Sin sesión'), idRubro: 1, local: { nombre: 'Casa', idCiudad: 1 } }).expect(401));

        it('crea la empresa y su primer local pendientes', async () => {
            const { company, office } = await propose();
            expect(company.estado).toBe('pendiente');
            expect(office).toMatchObject({ estado: 'pendiente', empresa: { id: company.id } });
        });

        it('valida el rubro y la ciudad', async () => {
            await http.post('/companies').set(bearer(user))
                .send({ nombre: unique('Rubro inválido'), idRubro: 999, local: { nombre: 'Casa', idCiudad: asuncion.id } }).expect(400);
            await http.post('/companies').set(bearer(user))
                .send({ nombre: unique('Sin local'), idRubro: sector.id }).expect(400);
        });

        it('no admite nombres repetidos sin distinguir mayúsculas ni tildes', async () => {
            const suffix = `${Date.now()}`;
            await propose(`Panadería Ñandutí ${suffix}`);
            await http.post('/companies').set(bearer(user))
                .send({ nombre: `PANADERIA NANDUTI ${suffix}`, idRubro: sector.id, local: { nombre: 'Casa', idCiudad: asuncion.id } })
                .expect(409);
        });
    });

    describe('Visibilidad: lo público muestra solo lo aprobado', () => {
        it('una empresa pendiente no aparece en el directorio ni en su detalle', async () => {
            const { company, office } = await propose();
            const list = (await http.get('/companies').query({ q: company.nombre }).expect(200)).body;
            expect(list.total).toBe(0);
            await http.get(`/companies/${company.id}`).expect(404);
            await http.get(`/offices/${office.id}`).expect(404);
        });

        it('el directorio no acepta el filtro de estado', () => http.get('/companies').query({ estado: 'pendiente' }).expect(400));

        it('los listados de administración solo son para el administrador', async () => {
            await http.get('/companies/admin').expect(401);
            await http.get('/companies/admin').set(bearer(user)).expect(403);
            await http.get('/offices/admin').set(bearer(user)).expect(403);
        });

        it('el administrador ve las pendientes', async () => {
            const { company } = await propose();
            const { body } = await http.get('/companies/admin').query({ estado: 'pendiente', q: company.nombre }).set(bearer(admin)).expect(200);
            expect(body.data.map((c: Ref) => c.id)).toEqual([company.id]);
            const offices = (await http.get('/offices/admin').query({ estado: 'pendiente', empresa: company.id }).set(bearer(admin)).expect(200)).body;
            expect(offices.data[0].empresa).toEqual({ id: company.id, nombre: company.nombre });
        });
    });

    describe('Aprobación y rechazo', () => {
        it('aprobar publica la empresa con sus locales pendientes', async () => {
            const { company } = await approved();
            const detail = (await http.get(`/companies/${company.id}`).expect(200)).body;
            expect(detail.estado).toBe('aprobada');
            expect(detail.locales).toHaveLength(1);
            expect(detail.locales[0].estado).toBe('aprobada');
        });

        it('solo el administrador aprueba, y una sola vez', async () => {
            const { company } = await propose();
            await http.patch(`/companies/${company.id}/approve`).set(bearer(user)).expect(403);
            await http.patch(`/companies/${company.id}/approve`).set(bearer(admin)).expect(200);
            await http.patch(`/companies/${company.id}/approve`).set(bearer(admin)).expect(409);
        });

        it('rechazar deja la empresa y sus locales fuera de lo público', async () => {
            const { company, office } = await propose();
            await http.patch(`/companies/${company.id}/reject`).set(bearer(admin)).expect(200);
            await http.get(`/companies/${company.id}`).expect(404);
            const offices = (await http.get('/offices/admin').query({ empresa: company.id }).set(bearer(admin)).expect(200)).body.data;
            expect(offices.find((o: Ref) => o.id === office.id).estado).toBe('rechazada');
            await http.post(`/companies/${company.id}/offices`).set(bearer(user)).send({ nombre: 'Otro', idCiudad: asuncion.id }).expect(409);
        });
    });

    describe('Locales', () => {
        it('un local nuevo de una empresa aprobada queda pendiente hasta aprobarlo', async () => {
            const { company } = await approved();
            const office = (await http.post(`/companies/${company.id}/offices`).set(bearer(user))
                .send({ nombre: 'Sucursal Norte', idCiudad: otherCity.id }).expect(201)).body;
            expect(office.estado).toBe('pendiente');
            await http.get(`/offices/${office.id}`).expect(404);
            await http.patch(`/offices/${office.id}/approve`).set(bearer(admin)).expect(200);
            expect((await http.get(`/offices/${office.id}`).expect(200)).body.estado).toBe('aprobada');
        });

        it('no se aprueba un local si su empresa todavía está pendiente', async () => {
            const { office } = await propose();
            await http.patch(`/offices/${office.id}/approve`).set(bearer(admin)).expect(409);
        });

        it('no admite dos locales con el mismo nombre en la misma empresa', async () => {
            const { company } = await approved();
            await http.post(`/companies/${company.id}/offices`).set(bearer(user)).send({ nombre: 'CASA CENTRAL', idCiudad: asuncion.id }).expect(409);
        });
    });

    describe('Directorio', () => {
        it('busca sin distinguir mayúsculas ni tildes', async () => {
            const suffix = `${Date.now()}`;
            const { company } = await approved(`Ferretería Ñemby ${suffix}`);
            const { body } = await http.get('/companies').query({ q: `ferreteria nemby ${suffix}` }).expect(200);
            expect(body.data.map((c: Ref) => c.id)).toEqual([company.id]);
        });

        it('filtra por ciudad según los locales aprobados', async () => {
            const { company } = await approved(undefined, otherCity.id);
            const inCity = (await http.get('/companies').query({ ciudad: otherCity.id, pageSize: 100 }).expect(200)).body.data;
            expect(inCity.map((c: Ref) => c.id)).toContain(company.id);
            const elsewhere = (await http.get('/companies').query({ ciudad: asuncion.id, pageSize: 100 }).expect(200)).body.data;
            expect(elsewhere.map((c: Ref) => c.id)).not.toContain(company.id);
        });
    });

    describe('Edición y baja', () => {
        it('el administrador edita nombre y rubro', async () => {
            const { company } = await approved();
            const nombre = unique('Nombre nuevo');
            const { body } = await http.put(`/companies/${company.id}`).set(bearer(admin)).send({ nombre, idRubro: sector.id }).expect(200);
            expect(body.nombre).toBe(nombre);
        });

        it('una empresa con locales no se elimina; sin locales, sí', async () => {
            const { company, office } = await approved();
            await http.delete(`/companies/${company.id}`).set(bearer(admin)).expect(409);
            await http.delete(`/offices/${office.id}`).set(bearer(admin)).expect(204);
            await http.delete(`/companies/${company.id}`).set(bearer(admin)).expect(204);
            await http.get(`/companies/${company.id}`).expect(404);
        });
    });
});
