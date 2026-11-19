import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/domain/user-role';
import { AuthenticatedUser } from '../../domain/model/auth-account';

// Toda ruta exige un token válido salvo que se marque con @Public() (seguro por defecto).
export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

// Roles que pueden usar la ruta. Sin @Roles, alcanza con estar autenticado.
export const ROLES = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES, roles);

// Usuario autenticado de la petición.
export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): AuthenticatedUser => ctx.switchToHttp().getRequest().user,
);
