import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Criterion } from './criterion.entity';

/** Categoría de criterios (por ejemplo «Contratación, formalidad y pagos»). */
@Entity({ name: 'categorias' })
export class CriteriaCategory {
    @PrimaryGeneratedColumn()
    id: number;

    /** Código estable (`CONTRATACION_PAGOS`), único. No se edita. */
    @Column({ length: 30 })
    codigo: string;

    /** Nombre visible; único sin distinguir mayúsculas («UQ_categorias_descripcion»). */
    @Column({ name: 'descripcion' })
    nombre: string;

    @Column()
    orden: number;

    /** Una categoría inactiva no se muestra ni se responde, con todos sus ítems. */
    @Column()
    activo: boolean;

    @OneToMany(() => Criterion, item => item.categoria)
    items: Criterion[];
}
