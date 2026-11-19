import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountStatus, UserRole } from 'src/shared/domain/user-role';

// Usuario con datos mínimos (Ley 7593/2025): email, hash de la contraseña, rol, estado y consentimiento.
@Entity({ name: 'usuarios' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // Se guarda en minúsculas; único (índice «UQ_usuarios_email» sobre lower(email))
    @Column()
    email: string;

    // Nunca sale de este módulo hacia una respuesta HTTP
    @Column({ name: 'hash_contrasena', select: false })
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, enumName: 'rol_usuario', default: UserRole.User })
    rol: UserRole;

    @Column({ type: 'enum', enum: AccountStatus, enumName: 'estado_cuenta', default: AccountStatus.Active })
    estado: AccountStatus;

    @Column({ name: 'fecha_consentimiento', type: 'timestamptz', nullable: true })
    fechaConsentimiento: Date | null;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
    fechaCreacion: Date;
}
