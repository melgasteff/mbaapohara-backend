import { AccountStatus, UserRole } from 'src/shared/domain/user-role';
import { User } from '../user.entity';

// Cuenta vista por el administrador. Nunca incluye la contraseña.
export class UserDTO {
    id: number;
    email: string;
    rol: UserRole;
    estado: AccountStatus;
    fechaConsentimiento: Date | null;
    fechaCreacion: Date;

    static from(user: User): UserDTO {
        return {
            id: user.id,
            email: user.email,
            rol: user.rol,
            estado: user.estado,
            fechaConsentimiento: user.fechaConsentimiento,
            fechaCreacion: user.fechaCreacion,
        };
    }
}

export class UserPageDTO {
    data: UserDTO[];
    total: number;
    page: number;
    pageSize: number;
}
