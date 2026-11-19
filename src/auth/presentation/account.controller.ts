import { Body, Controller, Delete, Get, HttpCode, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteMyAccountUseCase, ExportMyDataUseCase, GetMyAccountUseCase } from '../application/use-case/my-account.use-cases';
import { AuthenticatedUser } from '../domain/model/auth-account';
import { AuthExceptionFilter } from '../infrastructure/exception-filter/auth.exception-filter';
import { CurrentUser } from './decorator/auth.decorators';
import { AccountDTO, DeleteAccountDTO } from './dto/auth.dto';

// «Mi cuenta»: vive en auth porque opera sobre la cuenta propia y sus credenciales (ver docs/decisiones.md).
@ApiTags('Mi cuenta')
@UseFilters(AuthExceptionFilter)
@Controller('users/me')
export class AccountController {
    constructor(
        private readonly getMyAccountUC: GetMyAccountUseCase,
        private readonly exportMyDataUC: ExportMyDataUseCase,
        private readonly deleteMyAccountUC: DeleteMyAccountUseCase,
    ) { }

    @Get()
    get(@CurrentUser() user: AuthenticatedUser): Promise<AccountDTO> {
        return this.getMyAccountUC.execute(user.id);
    }

    /** Todos los datos de la cuenta y sus evaluaciones, en JSON (derecho de acceso). */
    @Get('export')
    export(@CurrentUser() user: AuthenticatedUser): Promise<unknown> {
        return this.exportMyDataUC.execute(user.id);
    }

    /** Elimina la cuenta y sus evaluaciones (D9). Pide la contraseña para confirmar. */
    @Delete()
    @HttpCode(204)
    delete(@CurrentUser() user: AuthenticatedUser, @Body() body: DeleteAccountDTO): Promise<void> {
        return this.deleteMyAccountUC.execute(user.id, body.password);
    }
}
