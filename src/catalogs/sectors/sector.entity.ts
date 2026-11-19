import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Rubro (sección de la CIIU Rev. 4).
@Entity({ name: 'rubros' })
export class Sector {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'codigo_ciiu', length: 1 })
    codigoCiiu: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;
}
