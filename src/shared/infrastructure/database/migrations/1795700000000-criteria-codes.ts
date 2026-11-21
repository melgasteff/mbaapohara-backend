import { MigrationInterface, QueryRunner } from 'typeorm';

// Tarea 3.8: el módulo `criteria` reemplaza a los heredados `categories` e `items`, que no conocían el código. El código
// pasa a ser obligatorio y único: las respuestas y la API identifican cada criterio por él, y no se edita.
// Las filas viejas sin código (los ítems genéricos anteriores a la 3.2) nunca se usaron en reseñas, porque solo cuentan
// los criterios con código: reciben uno derivado del id y quedan inactivas, como ya las dejaba la semilla.
export class CriteriaCodes1795700000000 implements MigrationInterface {
    name = 'CriteriaCodes1795700000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const [table, prefix] of [['categorias', 'CAT'], ['items', 'ITEM']]) {
            await queryRunner.query(`UPDATE ${table} SET codigo = '${prefix}_' || id, activo = false WHERE codigo IS NULL`);
            await queryRunner.query(`DROP INDEX "UQ_${table}_codigo"`);
            await queryRunner.query(`ALTER TABLE ${table} ALTER COLUMN codigo SET NOT NULL`);
            await queryRunner.query(`ALTER TABLE ${table} ADD CONSTRAINT "UQ_${table}_codigo" UNIQUE (codigo)`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const table of ['items', 'categorias']) {
            await queryRunner.query(`ALTER TABLE ${table} DROP CONSTRAINT "UQ_${table}_codigo"`);
            await queryRunner.query(`ALTER TABLE ${table} ALTER COLUMN codigo DROP NOT NULL`);
            await queryRunner.query(`CREATE UNIQUE INDEX "UQ_${table}_codigo" ON ${table} (codigo) WHERE codigo IS NOT NULL`);
        }
    }
}
