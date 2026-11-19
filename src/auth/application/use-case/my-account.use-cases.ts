import { AccountView } from '../../domain/model/auth-account';
import { PasswordHasher } from '../../domain/port/password-hasher.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';
import { AccountNotFoundException, InvalidCredentialsException } from '../exception/auth.exceptions';

// «Mi cuenta»: el titular ve, exporta o elimina sus datos (derechos de acceso y supresión).

export class GetMyAccountUseCase {
    constructor(private readonly accounts: UserAccounts) { }

    async execute(id: number): Promise<AccountView> {
        const account = await this.accounts.view(id);
        if (!account) throw new AccountNotFoundException();
        return account;
    }
}

export class ExportMyDataUseCase {
    constructor(private readonly accounts: UserAccounts) { }

    async execute(id: number): Promise<unknown> {
        return this.accounts.exportData(id);
    }
}

// Pide la contraseña para confirmar. D9: se eliminan también sus reseñas.
export class DeleteMyAccountUseCase {
    constructor(
        private readonly accounts: UserAccounts,
        private readonly hasher: PasswordHasher,
    ) { }

    async execute(id: number, password: string): Promise<void> {
        const account = await this.accounts.findById(id);
        if (!account) throw new AccountNotFoundException();
        if (!(await this.hasher.matches(password, account.passwordHash))) throw new InvalidCredentialsException();
        await this.accounts.delete(id);
    }
}
