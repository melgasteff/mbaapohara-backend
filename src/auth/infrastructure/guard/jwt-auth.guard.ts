import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AccountStatus } from 'src/shared/domain/user-role';
import { AuthenticatedUser } from '../../domain/model/auth-account';
import { TokenService } from '../../domain/port/token-service.port';
import { UserAccounts } from '../../domain/port/user-accounts.port';
import { IS_PUBLIC } from '../../presentation/decorator/auth.decorators';

// Guard global: verifica el token Bearer y carga la cuenta en cada petición, para que un bloqueo o un
// cambio de rol tengan efecto inmediato aunque el token siga vigente.
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokens: TokenService,
        private readonly accounts: UserAccounts,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
        const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
        if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Falta el token de acceso');

        const payload = await this.tokens.verify(token);
        if (!payload) throw new UnauthorizedException('Token inválido o vencido');

        const account = await this.accounts.findById(payload.sub);
        if (!account) throw new UnauthorizedException('La cuenta ya no existe');
        if (account.estado === AccountStatus.Blocked) throw new ForbiddenException('La cuenta está bloqueada');

        request.user = { id: account.id, email: account.email, rol: account.rol };
        return true;
    }
}
