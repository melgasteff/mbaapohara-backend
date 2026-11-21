import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sector } from 'src/catalogs/sectors/sector.entity';
import { Office } from './offices/office.entity';
import { ProposalStatus } from 'src/shared/domain/proposal-status';

@Entity({ name: 'empresas' })
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    // Único sin distinguir mayúsculas ni tildes (índice «UQ_empresas_nombre»)
    @Column()
    nombre: string;

    @Column({ name: 'id_rubro' })
    idRubro: number;

    // Relación de solo lectura hacia el catálogo, para mostrar el rubro en los listados
    @ManyToOne(() => Sector)
    @JoinColumn({ name: 'id_rubro' })
    rubro: Sector;

    @Column({ type: 'enum', enum: ProposalStatus, enumName: 'estado_propuesta', default: ProposalStatus.Pending })
    estado: ProposalStatus;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
    fechaCreacion: Date;

    @OneToMany(() => Office, office => office.empresa)
    locales: Office[];
}
