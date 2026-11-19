import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { EnvironmentVariables } from 'src/shared/infrastructure/config/env.validation';
import { UsersModule } from 'src/users/users.module';
import { CreateAdminUseCase } from '../../application/use-case/create-admin.use-case';
import { LoginUseCase } from '../../application/use-case/login.use-case';
import { DeleteMyAccountUseCase, ExportMyDataUseCase, GetMyAccountUseCase } from '../../application/use-case/my-account.use-cases';
import { RegisterUseCase } from '../../application/use-case/register.use-case';
import { PasswordHasher } from '../../domain/port/password-hasher.port';
import { TokenService } from '../../domain/port/token-service.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';
import { AccountController } from '../../presentation/account.controller';
import { AuthController } from '../../presentation/auth.controller';
import { BcryptPasswordHasher } from '../adapter/bcrypt-password-hasher';
import { JwtTokenService } from '../adapter/jwt-token-service';
import { UsersUserAccountsAdapter } from '../adapter/users-user-accounts.adapter';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/roles.guard';

// Los casos de uso no llevan decoradores de Nest: se crean acá con sus puertos.
const useCases: Provider[] = [
    { provide: RegisterUseCase, useFactory: (a: UserAccounts, h: PasswordHasher) => new RegisterUseCase(a, h), inject: [UserAccounts, PasswordHasher] },
    { provide: LoginUseCase, useFactory: (a: UserAccounts, h: PasswordHasher, t: TokenService) => new LoginUseCase(a, h, t), inject: [UserAccounts, PasswordHasher, TokenService] },
    { provide: GetMyAccountUseCase, useFactory: (a: UserAccounts) => new GetMyAccountUseCase(a), inject: [UserAccounts] },
    { provide: ExportMyDataUseCase, useFactory: (a: UserAccounts) => new ExportMyDataUseCase(a), inject: [UserAccounts] },
    { provide: DeleteMyAccountUseCase, useFactory: (a: UserAccounts, h: PasswordHasher) => new DeleteMyAccountUseCase(a, h), inject: [UserAccounts, PasswordHasher] },
    { provide: CreateAdminUseCase, useFactory: (a: UserAccounts, h: PasswordHasher) => new CreateAdminUseCase(a, h), inject: [UserAccounts, PasswordHasher] },
];

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
                secret: config.get('JWT_SECRET', { infer: true }),
                signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', { infer: true }) },
            }),
        }),
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
    ],
    controllers: [AuthController, AccountController],
    providers: [
        { provide: PasswordHasher, useClass: BcryptPasswordHasher },
        { provide: TokenService, useClass: JwtTokenService },
        { provide: UserAccounts, useClass: UsersUserAccountsAdapter },
        ...useCases,
        // Guards globales, en este orden: primero la autenticación, después el rol.
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
    exports: [CreateAdminUseCase],
})
export class AuthModule { }
