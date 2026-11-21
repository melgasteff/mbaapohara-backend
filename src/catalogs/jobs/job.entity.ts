import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cargos' })
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    // Única sin distinguir mayúsculas (índice «UQ_cargos_descripcion» sobre lower(descripcion))
    @Column()
    descripcion: string;

    /** Un cargo propuesto desde una reseña queda pendiente hasta que el administrador lo apruebe (como D10). */
    @Column({ type: 'enum', enum: ProposalStatus, enumName: 'estado_propuesta', default: ProposalStatus.Approved })
    estado: ProposalStatus;
}
