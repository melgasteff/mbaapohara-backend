import { MigrationInterface, QueryRunner } from 'typeorm';

// Tarea 2.3: registro de decisiones de moderación y gasto mensual del clasificador (política, secciones 9 y 10).
export class Moderation1795200000000 implements MigrationInterface {
    name = 'Moderation1795200000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE decisiones_moderacion (
                id serial PRIMARY KEY,
                id_resena int NULL,
                huella_texto char(64) NOT NULL,
                resultado varchar(20) NOT NULL CHECK (resultado IN ('publicada', 'en_revision', 'rechazada')),
                categoria varchar(10) NULL CHECK (categoria IN ('DP', 'TER', 'ACU', 'INS', 'SPAM', 'TEMA')),
                origen varchar(10) NOT NULL CHECK (origen IN ('reglas', 'modelo')),
                reglas text[] NOT NULL DEFAULT '{}',
                confianzas jsonb NULL,
                falla varchar(30) NULL,
                modelo varchar(60) NULL,
                version_instruccion varchar(60) NULL,
                motivo_modelo varchar(300) NULL,
                costo_usd numeric(12, 6) NOT NULL DEFAULT 0,
                fecha timestamptz NOT NULL DEFAULT now()
            )`);
        await queryRunner.query('CREATE INDEX "IDX_decisiones_moderacion_resena" ON decisiones_moderacion (id_resena)');
        await queryRunner.query('CREATE INDEX "IDX_decisiones_moderacion_fecha" ON decisiones_moderacion (fecha)');
        await queryRunner.query(`
            CREATE TABLE gasto_moderacion (
                mes char(7) PRIMARY KEY,
                costo_usd numeric(12, 6) NOT NULL DEFAULT 0,
                llamadas int NOT NULL DEFAULT 0
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE gasto_moderacion');
        await queryRunner.query('DROP TABLE decisiones_moderacion');
    }
}
