import { AccountStatus, UserRole } from 'src/shared/domain/user-role';

// Lo que auth necesita saber de una cuenta. No conoce TypeORM ni el módulo users.
export interface AuthAccount {
    id: number;
    email: string;
    passwordHash: string;
    rol: UserRole;
    estado: AccountStatus;
}

// Usuario autenticado en una petición (lo que viaja en request.user).
export interface AuthenticatedUser {
    id: number;
    email: string;
    rol: UserRole;
}

// Datos que el titular puede ver de su cuenta. Sin contraseña.
export interface AccountView {
    id: number;
    email: string;
    rol: UserRole;
    estado: AccountStatus;
    fechaConsentimiento: Date | null;
    fechaCreacion: Date;
}
