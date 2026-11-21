import { MigrationInterface, QueryRunner } from 'typeorm';

// Tarea 3.3: la persona que elimina una reseña la borra de verdad (derecho de supresión, como D9). La reseña, sus
// versiones y sus respuestas se borran en cascada; la decisión de moderación queda anónima (ON DELETE SET NULL).
// Sin reseñas «eliminadas», la unicidad por persona y local deja de ser parcial.
export class ReviewsHardDelete1795400000000 implements MigrationInterface {
    name = 'ReviewsHardDelete1795400000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM resenas WHERE eliminada');
        await queryRunner.query('DROP INDEX "UQ_resenas_usuario_sucursal"');
        await queryRunner.query('DROP INDEX "IDX_resenas_sucursal"');
        await queryRunner.query('ALTER TABLE resenas DROP COLUMN eliminada');
        await queryRunner.query('ALTER TABLE resenas ADD CONSTRAINT "UQ_resenas_usuario_sucursal" UNIQUE (id_usuario, id_sucursal)');
        await queryRunner.query('CREATE INDEX "IDX_resenas_sucursal" ON resenas (id_sucursal)');
        // Listados públicos: versiones publicadas por fecha de decisión.
        await queryRunner.query('CREATE INDEX "IDX_resenas_version_publicada" ON resenas (id_version_publicada) WHERE id_version_publicada IS NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_resenas_version_publicada"');
        await queryRunner.query('DROP INDEX "IDX_resenas_sucursal"');
        await queryRunner.query('ALTER TABLE resenas DROP CONSTRAINT "UQ_resenas_usuario_sucursal"');
        await queryRunner.query('ALTER TABLE resenas ADD COLUMN eliminada boolean NOT NULL DEFAULT false');
        await queryRunner.query('CREATE UNIQUE INDEX "UQ_resenas_usuario_sucursal" ON resenas (id_usuario, id_sucursal) WHERE NOT eliminada');
        await queryRunner.query('CREATE INDEX "IDX_resenas_sucursal" ON resenas (id_sucursal) WHERE NOT eliminada');
    }
}
