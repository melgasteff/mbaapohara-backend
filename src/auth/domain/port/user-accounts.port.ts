import { UserRole } from 'src/shared/domain/user-role';
import { AccountView, AuthAccount } from '../model/auth-account';

export interface NewAccount {
    email: string;
    passwordHash: string;
    rol: UserRole;
    fechaConsentimiento: Date | null;
}

// Puerto hacia las cuentas de usuario (adaptador: servicio del módulo users).
export abstract class UserAccounts {
    abstract findByEmail(email: string): Promise<AuthAccount | null>;
    abstract findById(id: number): Promise<AuthAccount | null>;
    abstract view(id: number): Promise<AccountView | null>;
    // Lanza EmailAlreadyRegisteredError si el email ya existe.
    abstract create(account: NewAccount): Promise<AccountView>;
    abstract setPasswordAndRole(id: number, passwordHash: string, rol: UserRole): Promise<void>;
    abstract exportData(id: number): Promise<unknown>;
    abstract delete(id: number): Promise<void>;
}
