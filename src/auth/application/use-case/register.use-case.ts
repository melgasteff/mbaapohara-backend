import { UserRole } from 'src/shared/domain/user-role';
import { AccountView } from '../../domain/model/auth-account';
import { PasswordHasher } from '../../domain/port/password-hasher.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';
import { ConsentRequiredException } from '../exception/auth.exceptions';

export interface RegisterRequest {
    email: string;
    password: string;
    aceptaTerminos: boolean;
}

// Registro con consentimiento: se guarda la fecha en que la persona aceptó términos y privacidad.
export class RegisterUseCase {
    constructor(
        private readonly accounts: UserAccounts,
        private readonly hasher: PasswordHasher,
    ) { }

    async execute(request: RegisterRequest): Promise<AccountView> {
        if (request.aceptaTerminos !== true) throw new ConsentRequiredException();
        return this.accounts.create({
            email: request.email,
            passwordHash: await this.hasher.hash(request.password),
            rol: UserRole.User,
            fechaConsentimiento: new Date(),
        });
    }
}
