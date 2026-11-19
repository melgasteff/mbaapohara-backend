import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Tarea 1.4 — empresas y locales.
 *
 * - Instala unaccent y crea f_unaccent(), una versión IMMUTABLE que permite usarla en índices.
 * - empresas: el rubro de texto pasa a ser una referencia a rubros (CIIU). Los valores de prueba se asignan
 *   con una tabla fija; si queda alguno sin asignar, la migración falla. Se agregan estado y fecha_creacion,
 *   y el nombre pasa a ser único sin distinguir mayúsculas ni tildes.
 * - sucursales (locales): se quitan email, teléfono y cantidad de empleados; se agregan direccion_referencia,
 *   estado y fecha_creacion; el nombre es único dentro de la empresa.
 * - estado: pendiente / aprobada / rechazada (D10). Lo existente queda aprobado.
 *
 * No es reversible (borra columnas con datos): la tarea 1.6 regenera la migración base.
 */
export class Companies1795112713198 implements MigrationInterface {
    name = 'Companies1795112713198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
        // unaccent() es STABLE (depende del diccionario); fijar el diccionario permite declararla IMMUTABLE.
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION f_unaccent(text) RETURNS text
            LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
            AS $func$ SELECT public.unaccent('public.unaccent', $1) $func$`);

        await queryRunner.query(`CREATE TYPE estado_propuesta AS ENUM ('pendiente', 'aprobada', 'rechazada')`);

        // ---------- empresas
        await queryRunner.query(`ALTER TABLE empresas ADD COLUMN id_rubro integer`);
        await queryRunner.query(`
            UPDATE empresas e SET id_rubro = r.id
            FROM (VALUES
                ('telecomunicaciones', 'J'), ('tecnología', 'J'),
                ('financiero', 'K'),
                ('retail', 'G'), ('e-commerce', 'G'), ('supermercados', 'G'),
                ('delivery', 'H'), ('aviación', 'H'),
                ('contact center', 'N'),
                ('construcción', 'F')
            ) AS m(rubro, codigo)
            JOIN rubros r ON r.codigo_ciiu = m.codigo
            WHERE lower(trim(e.rubro)) = m.rubro`);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM empresas WHERE id_rubro IS NULL) THEN
                    RAISE EXCEPTION 'Hay empresas con un rubro de texto que no se pudo asignar a una sección CIIU';
                END IF;
            END $$`);
        await queryRunner.query(`ALTER TABLE empresas DROP COLUMN rubro`);
        await queryRunner.query(`ALTER TABLE empresas ALTER COLUMN id_rubro SET NOT NULL, ALTER COLUMN nombre SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE empresas ADD CONSTRAINT "FK_empresas_rubro" FOREIGN KEY (id_rubro) REFERENCES rubros (id)`);
        await queryRunner.query(`
            ALTER TABLE empresas
                ADD COLUMN estado estado_propuesta NOT NULL DEFAULT 'pendiente',
                ADD COLUMN fecha_creacion timestamptz NOT NULL DEFAULT now()`);
        await queryRunner.query(`UPDATE empresas SET estado = 'aprobada'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_empresas_nombre" ON empresas (lower(f_unaccent(nombre)))`);
        await queryRunner.query(`CREATE INDEX "IDX_empresas_estado" ON empresas (estado)`);

        // ---------- sucursales (locales)
        await queryRunner.query(`ALTER TABLE sucursales DROP COLUMN email, DROP COLUMN telefono, DROP COLUMN cantidad_empleados`);
        await queryRunner.query(`
            ALTER TABLE sucursales
                ADD COLUMN direccion_referencia varchar(200),
                ADD COLUMN estado estado_propuesta NOT NULL DEFAULT 'pendiente',
                ADD COLUMN fecha_creacion timestamptz NOT NULL DEFAULT now()`);
        await queryRunner.query(`UPDATE sucursales SET estado = 'aprobada'`);
        await queryRunner.query(`ALTER TABLE sucursales ALTER COLUMN nombre SET NOT NULL`);
        // La FK hacia empresas se creó NOT VALID en la migración inicial: se valida ahora.
        await queryRunner.query(`ALTER TABLE sucursales VALIDATE CONSTRAINT id_empresa`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_sucursales_empresa_nombre" ON sucursales (id_empresa, lower(f_unaccent(nombre)))`);
        await queryRunner.query(`CREATE INDEX "IDX_sucursales_ciudad" ON sucursales (id_ciudad)`);
    }

    public async down(): Promise<void> {
        throw new Error('La migración de empresas no es reversible: borra columnas con datos. Restaurar desde un respaldo.');
    }
}
