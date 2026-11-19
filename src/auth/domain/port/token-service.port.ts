import { UserRole } from 'src/shared/domain/user-role';

export interface TokenPayload {
    sub: number;
    rol: UserRole;
}

// Puerto para emitir y verificar tokens de acceso (adaptador: JWT).
export abstract class TokenService {
    abstract sign(payload: TokenPayload): Promise<{ token: string; expiresIn: string }>;
    // Devuelve null si el token es inválido o venció.
    abstract verify(token: string): Promise<TokenPayload | null>;
}
