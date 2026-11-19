import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Tarea 1.5 — usuario mínimo (Ley 7593/2025, minimización de datos) y borrado en cascada (D9).
 *
 * - usuarios queda con email (único, en minúsculas), hash de la contraseña, rol, estado y fecha de
 *   consentimiento. Se borran nombre, apellido, usuario, ciudad, descripción y tipo.
 * - fecha_consentimiento admite NULL solo por el usuario de prueba existente, que nunca aceptó términos; la API
 *   la exige en todo registro. La migración base de la tarea 1.6 la deja NOT NULL.
 * - Borrar un usuario borra sus evaluaciones, y borrar una evaluación borra sus detalles (D9).
 *
 * No es reversible (borra columnas con datos): la tarea 1.6 regenera la migración base.
 */
export class UsersMinimal1795113452748 implements MigrationInterface {
    name = 'UsersMinimal1795113452748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE rol_usuario AS ENUM ('usuario', 'administrador')`);
        await queryRunner.query(`CREATE TYPE estado_cuenta AS ENUM ('activo', 'bloqueado')`);

        await queryRunner.query(`
            ALTER TABLE usuarios
                ADD COLUMN rol rol_usuario NOT NULL DEFAULT 'usuario',
                ADD COLUMN estado estado_cuenta NOT NULL DEFAULT 'activo',
                ADD COLUMN fecha_consentimiento timestamptz,
                ADD COLUMN fecha_creacion timestamptz NOT NULL DEFAULT now()`);
        await queryRunner.query(`UPDATE usuarios SET rol = 'administrador' WHERE upper(tipo_usuario) IN ('ADMIN', 'ADMINISTRADOR')`);

        await queryRunner.query(`ALTER TABLE usuarios DROP CONSTRAINT "FK_3785318df310caf8cb8e1e37d85"`);
        await queryRunner.query(`
            ALTER TABLE usuarios
                DROP COLUMN nombre, DROP COLUMN apellido, DROP COLUMN usuario,
                DROP COLUMN descripcion, DROP COLUMN tipo_usuario, DROP COLUMN id_ciudad`);
        await queryRunner.query(`ALTER TABLE usuarios RENAME COLUMN contrasena TO hash_contrasena`);

        await queryRunner.query(`UPDATE usuarios SET email = lower(trim(email))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_usuarios_email" ON usuarios (lower(email))`);

        // D9: al eliminar la cuenta se eliminan sus reseñas (y lo que depende de ellas)
        await queryRunner.query(`ALTER TABLE evaluaciones DROP CONSTRAINT id_usuario`);
        await queryRunner.query(`
            ALTER TABLE evaluaciones ADD CONSTRAINT "FK_evaluaciones_usuario"
                FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE detalle_evaluacion DROP CONSTRAINT detalle_evaluacion_id_evaluacion_fkey`);
        await queryRunner.query(`
            ALTER TABLE detalle_evaluacion ADD CONSTRAINT "FK_detalle_evaluacion_evaluacion"
                FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones (id) ON DELETE CASCADE`);
        // Tablas heredadas sin uso (se eliminan en la 1.6): también en cascada, para no bloquear el borrado
        for (const table of ['entrevistas', 'sueldos', 'resenhas', 'detalles_beneficios']) {
            await queryRunner.query(`ALTER TABLE ${table} DROP CONSTRAINT id_evaluacion`);
            await queryRunner.query(`
                ALTER TABLE ${table} ADD CONSTRAINT "FK_${table}_evaluacion"
                    FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones (id) ON DELETE CASCADE`);
        }
    }

    public async down(): Promise<void> {
        throw new Error('La migración de usuarios no es reversible: borra columnas con datos. Restaurar desde un respaldo.');
    }
}
