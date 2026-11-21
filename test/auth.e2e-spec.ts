import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { adminToken, bearer, createTestApp, login, PASSWORD, register, uniqueEmail, userToken } from './setup/helpers';

describe('Autenticación y mi cuenta (e2e)', () => {
    let app: INestApplication;
    let http: ReturnType<typeof request>;

    beforeAll(async () => {
        app = await createTestApp();
        http = request(app.getHttpServer());
    });
    afterAll(() => app.close());

    describe('POST /auth/register', () => {
        it('crea una cuenta con datos mínimos y sin devolver la contraseña', async () => {
            const email = uniqueEmail();
            const { body } = await http.post('/auth/register').send({ email, password: PASSWORD, aceptaTerminos: true }).expect(201);
            expect(body).toMatchObject({ email, rol: 'usuario', estado: 'activo' });
            expect(body.fechaConsentimiento).toBeTruthy();
            expect(JSON.stringify(body)).not.toMatch(/password|hash|Clave-segura/i);
        });

        it('normaliza el correo (espacios y mayúsculas)', async () => {
            const email = uniqueEmail();
            const { body } = await http.post('/auth/register').send({ email: `  ${email.toUpperCase()} `, password: PASSWORD, aceptaTerminos: true }).expect(201);
            expect(body.email).toBe(email);
        });

        it('exige aceptar los términos', () =>
            http.post('/auth/register').send({ email: uniqueEmail(), password: PASSWORD, aceptaTerminos: false }).expect(400));

        it('rechaza una contraseña débil', () =>
            http.post('/auth/register').send({ email: uniqueEmail(), password: 'clave123', aceptaTerminos: true }).expect(400));

        it('rechaza campos que no existen en el DTO', () =>
            http.post('/auth/register').send({ email: uniqueEmail(), password: PASSWORD, aceptaTerminos: true, rol: 'administrador' }).expect(400));

        it('no permite dos cuentas con el mismo correo', async () => {
            const { email } = await register(app);
            await http.post('/auth/register').send({ email, password: PASSWORD, aceptaTerminos: true }).expect(409);
        });
    });

    describe('POST /auth/login', () => {
        it('devuelve un token Bearer', async () => {
            const { email } = await register(app);
            const { body } = await http.post('/auth/login').send({ email, password: PASSWORD }).expect(200);
            expect(body).toMatchObject({ tokenType: 'Bearer', expiresIn: expect.any(String) });
            expect(body.accessToken.split('.')).toHaveLength(3);
        });

        it('responde 401 con la contraseña incorrecta o un correo que no existe', async () => {
            const { email } = await register(app);
            await http.post('/auth/login').send({ email, password: 'Otra-clave-2026' }).expect(401);
            await http.post('/auth/login').send({ email: uniqueEmail('nadie'), password: PASSWORD }).expect(401);
        });
    });

    describe('Rutas protegidas', () => {
        it('exigen token: sin token o con uno inválido responden 401', async () => {
            await http.get('/users/me').expect(401);
            await http.get('/users/me').set(bearer('no.es.un-token')).expect(401);
        });

        it('las de administración responden 403 a una cuenta común', async () => {
            const { token } = await userToken(app);
            await http.get('/users').set(bearer(token)).expect(403);
        });
    });

    describe('Mi cuenta (/users/me)', () => {
        it('muestra y exporta los datos propios', async () => {
            const { email, token } = await userToken(app);
            const me = await http.get('/users/me').set(bearer(token)).expect(200);
            expect(me.body).toMatchObject({ email, rol: 'usuario' });
            const exported = await http.get('/users/me/export').set(bearer(token)).expect(200);
            expect(JSON.stringify(exported.body)).toContain(email);
            expect(exported.body.resenas).toEqual([]);
        });

        it('elimina la cuenta con la contraseña y el token deja de servir', async () => {
            const { email, token } = await userToken(app);
            await http.delete('/users/me').set(bearer(token)).send({ password: 'Otra-clave-2026' }).expect(401);
            await http.delete('/users/me').set(bearer(token)).send({ password: PASSWORD }).expect(204);
            await http.get('/users/me').set(bearer(token)).expect(401);
            await http.post('/auth/login').send({ email, password: PASSWORD }).expect(401);
        });
    });

    describe('Cuenta bloqueada', () => {
        it('no puede ingresar y su token deja de valer en el momento', async () => {
            const admin = await adminToken(app);
            const user = await userToken(app);
            await http.patch(`/users/${user.id}/block`).set(bearer(admin)).expect(200);
            await http.get('/users/me').set(bearer(user.token)).expect(403);
            await http.post('/auth/login').send({ email: user.email, password: PASSWORD }).expect(403);
            await http.patch(`/users/${user.id}/unblock`).set(bearer(admin)).expect(200);
            await login(app, user.email);
        });
    });
});
