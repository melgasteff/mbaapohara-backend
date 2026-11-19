import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'departamentos' })
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'codigo_ine', length: 2 })
    codigoIne: string;

    @Column()
    nombre: string;
}
