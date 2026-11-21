import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUniqueViolation, violatedConstraint } from 'src/shared/infrastructure/database/pg-errors';
import { CreateCategoryDTO, CreateCriterionDTO, UpdateCategoryDTO, UpdateCriterionDTO } from './dto/save-criteria.dto';
import { CriteriaCategory } from './entities/category.entity';
import { Criterion } from './entities/criterion.entity';

// Mensaje de cada restricción UNIQUE de categorias e items (migraciones base y 1795700000000).
const DUPLICATE: Record<string, string> = {
    UQ_categorias_codigo: 'Ya existe una categoría con ese código',
    UQ_categorias_descripcion: 'Ya existe una categoría con ese nombre',
    UQ_items_codigo: 'Ya existe un ítem con ese código',
    UQ_items_categoria_descripcion: 'Esa categoría ya tiene un ítem con ese texto',
};

/**
 * Criterios de la reseña (tarea 3.8): categorías e ítems. La base es la fuente de verdad; el administrador los crea,
 * edita y desactiva. No se borran, para que las respuestas guardadas sigan apuntando a su criterio.
 */
@Injectable()
export class CriteriaService {
    constructor(
        @InjectRepository(CriteriaCategory) private readonly categories: Repository<CriteriaCategory>,
        @InjectRepository(Criterion) private readonly items: Repository<Criterion>,
        private readonly dataSource: DataSource,
    ) { }

    /** Lo que se responde y se muestra: categorías activas con sus ítems activos, en orden. Sin categorías vacías. */
    async findActive(): Promise<CriteriaCategory[]> {
        const categories = await this.categories.createQueryBuilder('c')
            .innerJoinAndSelect('c.items', 'i', 'i.activo')
            .where('c.activo')
            .orderBy('c.orden').addOrderBy('c.id').addOrderBy('i.orden').addOrderBy('i.id')
            .getMany();
        return categories.filter(category => category.items.length > 0);
    }

    /** Ítems que una reseña tiene que responder, en orden (los usa `reviews` para validar R2). */
    async activeCriteria(): Promise<{ id: number; code: string }[]> {
        return (await this.findActive()).flatMap(category => category.items.map(item => ({ id: item.id, code: item.codigo })));
    }

    /** Administración: todas las categorías y todos los ítems, activos o no. */
    findAll(): Promise<CriteriaCategory[]> {
        return this.categories.createQueryBuilder('c')
            .leftJoinAndSelect('c.items', 'i')
            .orderBy('c.orden').addOrderBy('c.id').addOrderBy('i.orden').addOrderBy('i.id')
            .getMany();
    }

    /**
     * Cantidad de respuestas guardadas por ítem, para avisar al editar un texto que ya se respondió. Es una sola
     * consulta de conteo sobre `respuestas_criterio` (del módulo `reviews`): importar `reviews` crearía un ciclo,
     * porque `reviews` ya usa este servicio.
     */
    async answerCounts(): Promise<Map<number, number>> {
        const rows: { id: number; total: number }[] = await this.dataSource.query(
            'SELECT id_item AS id, count(*)::int AS total FROM respuestas_criterio GROUP BY id_item');
        return new Map(rows.map(row => [row.id, row.total]));
    }

    async createCategory(body: CreateCategoryDTO): Promise<CriteriaCategory> {
        const orden = body.orden ?? await this.nextOrder('categorias');
        const category = await this.save(this.categories, this.categories.create({ ...body, orden, activo: true }));
        category.items = [];
        return category;
    }

    async updateCategory(id: number, body: UpdateCategoryDTO): Promise<CriteriaCategory> {
        const category = await this.categories.findOne({ where: { id }, relations: { items: true } });
        if (!category) throw new NotFoundException(`No existe la categoría ${id}`);
        return this.save(this.categories, Object.assign(category, body));
    }

    async createCriterion(body: CreateCriterionDTO): Promise<Criterion> {
        if (!await this.categories.existsBy({ id: body.idCategoria })) {
            throw new BadRequestException(`No existe la categoría ${body.idCategoria}`);
        }
        const orden = body.orden ?? await this.nextOrder('items', body.idCategoria);
        return this.save(this.items, this.items.create({ ...body, orden, activo: true }));
    }

    async updateCriterion(id: number, body: UpdateCriterionDTO): Promise<Criterion> {
        const item = await this.items.findOneBy({ id });
        if (!item) throw new NotFoundException(`No existe el ítem ${id}`);
        return this.save(this.items, Object.assign(item, body));
    }

    /** Respuestas guardadas de un ítem. */
    async answersOf(id: number): Promise<number> {
        const [{ total }] = await this.dataSource.query(
            'SELECT count(*)::int AS total FROM respuestas_criterio WHERE id_item = $1', [id]);
        return total;
    }

    /** Siguiente posición: al final de las categorías, o de los ítems de una categoría. */
    private async nextOrder(table: 'categorias' | 'items', idCategoria?: number): Promise<number> {
        const [{ orden }] = table === 'categorias'
            ? await this.dataSource.query('SELECT coalesce(max(orden), 0) + 1 AS orden FROM categorias')
            : await this.dataSource.query('SELECT coalesce(max(orden), 0) + 1 AS orden FROM items WHERE id_categoria = $1', [idCategoria]);
        return orden;
    }

    // El duplicado lo detecta la restricción UNIQUE de la base, no una búsqueda previa.
    private async save<T extends object>(repo: Repository<T>, entity: T): Promise<T> {
        try {
            return await repo.save(entity);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictException(DUPLICATE[violatedConstraint(error) ?? ''] ?? 'Ya existe un criterio igual');
            }
            throw error;
        }
    }
}
