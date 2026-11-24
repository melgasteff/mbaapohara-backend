import { MigrationInterface, QueryRunner } from 'typeorm';

// Rediseño, fase 2: qué reseña es pública se define en un solo lugar (versión publicada, en un local y una empresa
// aprobados). La leen `reviews` (listado) y `companies` (resumen y facetas del directorio). No lleva el autor.
export class PublicReviewsView1795800000000 implements MigrationInterface {
    name = 'PublicReviewsView1795800000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE VIEW resenas_publicas AS
            SELECT r.id AS id_resena, v.id AS id_version, e.id AS id_empresa, s.id AS id_sucursal, s.id_ciudad, v.calificacion
            FROM resenas r
            JOIN versiones_resena v ON v.id = r.id_version_publicada
            JOIN sucursales s ON s.id = r.id_sucursal AND s.estado = 'aprobada'
            JOIN empresas e ON e.id = s.id_empresa AND e.estado = 'aprobada'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP VIEW resenas_publicas');
    }
}
