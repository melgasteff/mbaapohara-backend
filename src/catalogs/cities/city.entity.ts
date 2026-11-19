import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../departments/department.entity';

// Distrito del INE. En la API se lo llama «ciudad», como en el plan.
@Entity({ name: 'ciudades' })
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'codigo_ine', length: 4 })
    codigoIne: string;

    @Column()
    nombre: string;

    @Column({ name: 'id_departamento' })
    idDepartamento: number;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'id_departamento' })
    departamento: Department;
}
