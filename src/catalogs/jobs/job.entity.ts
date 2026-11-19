import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cargos' })
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    // Única sin distinguir mayúsculas (índice «UQ_cargos_descripcion» sobre lower(descripcion))
    @Column()
    descripcion: string;
}
