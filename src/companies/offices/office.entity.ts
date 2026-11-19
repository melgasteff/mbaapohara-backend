import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from 'src/catalogs/cities/city.entity';
import { Company } from '../company.entity';
import { ProposalStatus } from '../proposal-status';

// Local (tabla sucursales). Sin datos de contacto: nombre, ciudad y una dirección de referencia.
@Entity({ name: 'sucursales' })
export class Office {
    @PrimaryGeneratedColumn()
    id: number;

    // Único dentro de la empresa, sin distinguir mayúsculas ni tildes (índice «UQ_sucursales_empresa_nombre»)
    @Column()
    nombre: string;

    @Column({ name: 'id_empresa' })
    idEmpresa: number;

    @ManyToOne(() => Company, company => company.locales)
    @JoinColumn({ name: 'id_empresa' })
    empresa: Company;

    @Column({ name: 'id_ciudad' })
    idCiudad: number;

    // Relación de solo lectura hacia el catálogo, para mostrar la ciudad
    @ManyToOne(() => City)
    @JoinColumn({ name: 'id_ciudad' })
    ciudad: City;

    @Column({ name: 'direccion_referencia', type: 'varchar', length: 200, nullable: true })
    direccionReferencia: string | null;

    @Column({ type: 'enum', enum: ProposalStatus, enumName: 'estado_propuesta', default: ProposalStatus.Pending })
    estado: ProposalStatus;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
    fechaCreacion: Date;
}
