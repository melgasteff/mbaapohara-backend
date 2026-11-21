import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/shared/domain/user-role';
import { User } from 'src/users/user.entity';
import { EmailTakenError, UsersService } from 'src/users/users.service';
import { EmailAlreadyRegisteredException } from '../../application/exception/auth.exceptions';
import { AccountView, AuthAccount } from '../../domain/model/auth-account';
import { NewAccount, UserAccounts } from '../../domain/port/user-accounts.port';

// Adaptador del puerto UserAccounts sobre el servicio del módulo users (regla 3 de docs/arquitectura.md).
@Injectable()
export class UsersUserAccountsAdapter implements UserAccounts {
    constructor(private readonly users: UsersService) { }

    async findByEmail(email: string): Promise<AuthAccount | null> {
        return toAccount(await this.users.findWithPasswordByEmail(email));
    }

    async findById(id: number): Promise<AuthAccount | null> {
        return toAccount(await this.users.findWithPasswordById(id));
    }

    async view(id: number): Promise<AccountView | null> {
        return toView(await this.users.findById(id));
    }

    async create(account: NewAccount): Promise<AccountView> {
        try {
            return toView(await this.users.create(account));
        } catch (error) {
            if (error instanceof EmailTakenError) throw new EmailAlreadyRegisteredException();
            throw error;
        }
    }

    setPasswordAndRole(id: number, passwordHash: string, rol: UserRole): Promise<void> {
        return this.users.setPasswordAndRole(id, passwordHash, rol);
    }

    async exportData(id: number): Promise<unknown> {
        const { cuenta, resenas } = await this.users.exportData(id);
        return { cuenta: toView(cuenta), resenas, fechaExportacion: new Date() };
    }

    delete(id: number): Promise<void> {
        return this.users.remove(id);
    }
}

function toAccount(user: User | null): AuthAccount | null {
    return user && { id: user.id, email: user.email, passwordHash: user.passwordHash, rol: user.rol, estado: user.estado };
}

function toView(user: User | null): AccountView | null {
    return user && {
        id: user.id, email: user.email, rol: user.rol, estado: user.estado,
        fechaConsentimiento: user.fechaConsentimiento, fechaCreacion: user.fechaCreacion,
    };
}
