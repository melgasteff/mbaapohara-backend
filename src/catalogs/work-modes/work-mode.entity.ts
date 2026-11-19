import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modalidad de trabajo (decisión R5).
@Entity({ name: 'modalidades' })
export class WorkMode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}
