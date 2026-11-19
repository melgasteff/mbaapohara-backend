import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentVariables } from 'src/shared/infrastructure/config/env.validation';
import { TokenPayload, TokenService } from '../../domain/port/token-service.port';

@Injectable()
export class JwtTokenService implements TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService<EnvironmentVariables, true>,
    ) { }

    async sign(payload: TokenPayload): Promise<{ token: string; expiresIn: string }> {
        return { token: await this.jwt.signAsync(payload), expiresIn: this.config.get('JWT_EXPIRES_IN', { infer: true }) };
    }

    async verify(token: string): Promise<TokenPayload | null> {
        try {
            const { sub, rol } = await this.jwt.verifyAsync<TokenPayload>(token);
            return typeof sub === 'number' ? { sub, rol } : null;
        } catch {
            return null;
        }
    }
}
