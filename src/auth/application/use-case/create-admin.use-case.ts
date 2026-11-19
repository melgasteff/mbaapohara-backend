import { UserRole } from 'src/shared/domain/user-role';
import { PasswordHasher } from '../../domain/port/password-hasher.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';

// Crea el primer administrador, o promueve una cuenta existente y le fija la contraseña (D5).
// Se usa desde la línea de comandos (npm run admin:create), nunca desde la API.
export class CreateAdminUseCase {
    constructor(
        private readonly accounts: UserAccounts,
        private readonly hasher: PasswordHasher,
    ) { }

    async execute(email: string, password: string): Promise<'creada' | 'promovida'> {
        const passwordHash = await this.hasher.hash(password);
        const existing = await this.accounts.findByEmail(email);
        if (existing) {
            await this.accounts.setPasswordAndRole(existing.id, passwordHash, UserRole.Admin);
            return 'promovida';
        }
        await this.accounts.create({ email, passwordHash, rol: UserRole.Admin, fechaConsentimiento: new Date() });
        return 'creada';
    }
}
