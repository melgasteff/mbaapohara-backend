import { MigrationInterface, QueryRunner } from 'typeorm';

// Tarea 3.9a: la revisión humana queda en el registro de decisiones (política, sección 9): origen «persona», quién
// decidió y el motivo que lee quien escribió. Si se elimina la cuenta del administrador, la decisión queda sin él.
export class HumanModeration1795500000000 implements MigrationInterface {
    name = 'HumanModeration1795500000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE decisiones_moderacion DROP CONSTRAINT decisiones_moderacion_origen_check');
        await queryRunner.query(`ALTER TABLE decisiones_moderacion
            ADD CONSTRAINT decisiones_moderacion_origen_check CHECK (origen IN ('reglas', 'modelo', 'persona')),
            ADD COLUMN id_administrador integer NULL,
            ADD COLUMN motivo_decision varchar(500) NULL,
            ADD CONSTRAINT "FK_decisiones_moderacion_administrador" FOREIGN KEY (id_administrador) REFERENCES usuarios (id) ON DELETE SET NULL`);
        await queryRunner.query('CREATE INDEX "IDX_decisiones_moderacion_version" ON decisiones_moderacion (id_version_resena)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_decisiones_moderacion_version"');
        await queryRunner.query(`DELETE FROM decisiones_moderacion WHERE origen = 'persona'`);
        await queryRunner.query(`ALTER TABLE decisiones_moderacion
            DROP CONSTRAINT "FK_decisiones_moderacion_administrador",
            DROP COLUMN motivo_decision,
            DROP COLUMN id_administrador,
            DROP CONSTRAINT decisiones_moderacion_origen_check`);
        await queryRunner.query(`ALTER TABLE decisiones_moderacion
            ADD CONSTRAINT decisiones_moderacion_origen_check CHECK (origen IN ('reglas', 'modelo'))`);
    }
}
