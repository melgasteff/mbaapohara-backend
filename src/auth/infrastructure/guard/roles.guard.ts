import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/shared/domain/user-role';
import { AuthenticatedUser } from '../../domain/model/auth-account';
import { ROLES } from '../../presentation/decorator/auth.decorators';

// Guard global: corre después de JwtAuthGuard y exige uno de los roles de @Roles(), si los hay.
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [context.getHandler(), context.getClass()]);
        if (!roles?.length) return true;
        const user: AuthenticatedUser | undefined = context.switchToHttp().getRequest().user;
        if (!user || !roles.includes(user.rol)) throw new ForbiddenException('No tienes permiso para esta acción');
        return true;
    }
}
