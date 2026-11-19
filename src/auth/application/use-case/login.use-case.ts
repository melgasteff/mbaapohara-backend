import { AccountStatus } from 'src/shared/domain/user-role';
import { PasswordHasher } from '../../domain/port/password-hasher.port';
import { TokenService } from '../../domain/port/token-service.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';
import { AccountBlockedException, InvalidCredentialsException } from '../exception/auth.exceptions';

export class LoginUseCase {
    // Hash de una contraseña al azar, generado con el mismo hasher la primera vez. Si el email no existe, se
    // compara contra este hash igual, para que la respuesta tarde lo mismo y no revele qué emails tienen cuenta.
    private dummyHash?: Promise<string>;

    constructor(
        private readonly accounts: UserAccounts,
        private readonly hasher: PasswordHasher,
        private readonly tokens: TokenService,
    ) { }

    async execute(email: string, password: string): Promise<{ token: string; expiresIn: string }> {
        const account = await this.accounts.findByEmail(email);
        this.dummyHash ??= this.hasher.hash(`sin-cuenta-${Math.random()}`);
        const matches = await this.hasher.matches(password, account?.passwordHash ?? await this.dummyHash);
        if (!account || !matches) throw new InvalidCredentialsException();
        if (account.estado === AccountStatus.Blocked) throw new AccountBlockedException();
        return this.tokens.sign({ sub: account.id, rol: account.rol });
    }
}
