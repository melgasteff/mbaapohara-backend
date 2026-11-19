import { Body, Controller, HttpCode, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginUseCase } from '../application/use-case/login.use-case';
import { RegisterUseCase } from '../application/use-case/register.use-case';
import { AuthExceptionFilter } from '../infrastructure/exception-filter/auth.exception-filter';
import { Public } from './decorator/auth.decorators';
import { AccountDTO, LoginDTO, RegisterDTO, TokenDTO } from './dto/auth.dto';

// Límite de intentos: 5 por minuto y por IP en cada ruta; el sexto responde 429.
@ApiTags('Autenticación')
@Public()
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@UseFilters(AuthExceptionFilter)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUC: RegisterUseCase,
        private readonly loginUC: LoginUseCase,
    ) { }

    /** Crea una cuenta de usuario. Exige aceptar los términos y la política de privacidad. */
    @Post('register')
    register(@Body() body: RegisterDTO): Promise<AccountDTO> {
        return this.registerUC.execute(body);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() body: LoginDTO): Promise<TokenDTO> {
        const { token, expiresIn } = await this.loginUC.execute(body.email, body.password);
        return { accessToken: token, tokenType: 'Bearer', expiresIn };
    }
}
