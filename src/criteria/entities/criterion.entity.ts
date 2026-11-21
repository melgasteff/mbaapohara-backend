import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CriteriaCategory } from './category.entity';

/** Ítem que se responde en la reseña con Sí / En parte / No / No sé (R2). Tabla `items`. */
@Entity({ name: 'items' })
export class Criterion {
    @PrimaryGeneratedColumn()
    id: number;

    /** Código estable (`CP01`), único. Las respuestas y la API lo usan; no se edita. */
    @Column({ length: 30 })
    codigo: string;

    /** Afirmación que se responde; única dentro de su categoría («UQ_items_categoria_descripcion»). */
    @Column({ name: 'descripcion' })
    texto: string;

    @Column({ name: 'id_categoria' })
    idCategoria: number;

    @ManyToOne(() => CriteriaCategory, category => category.items)
    @JoinColumn({ name: 'id_categoria' })
    categoria: CriteriaCategory;

    @Column()
    orden: number;

    /** Un ítem inactivo deja de pedirse en las reseñas nuevas y de mostrarse; sus respuestas viejas se conservan. */
    @Column()
    activo: boolean;
}
