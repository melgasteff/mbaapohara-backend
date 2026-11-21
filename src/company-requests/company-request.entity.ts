import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RequestType {
    ReviewRevision = 'revision_resena',
    DataCorrection = 'correccion_datos',
}

export enum RequestStatus {
    Pending = 'pendiente',
    Answered = 'respondida',
}

// Solicitud de una empresa (D5: las empresas no tienen cuenta). Nombre y correo solo mientras está abierta.
@Entity({ name: 'solicitudes_empresa' })
export class CompanyRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: RequestType, enumName: 'tipo_solicitud' })
    tipo: RequestType;

    @Column({ name: 'id_resena', type: 'int', nullable: true })
    idResena: number | null;

    @Column({ name: 'id_empresa', type: 'int', nullable: true })
    idEmpresa: number | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    nombre: string | null;

    @Column({ type: 'varchar', length: 254, nullable: true })
    correo: string | null;

    @Column({ type: 'varchar', length: 2000 })
    mensaje: string;

    @Column({ type: 'enum', enum: RequestStatus, enumName: 'estado_solicitud', default: RequestStatus.Pending })
    estado: RequestStatus;

    @Column({ type: 'varchar', length: 2000, nullable: true })
    respuesta: string | null;

    @Column({ name: 'id_administrador', type: 'int', nullable: true })
    idAdministrador: number | null;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha: Date;

    @Column({ name: 'fecha_respuesta', type: 'timestamptz', nullable: true })
    fechaRespuesta: Date | null;
}
