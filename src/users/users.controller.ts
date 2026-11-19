import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/domain/model/auth-account';
import { CurrentUser, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { mapPage } from 'src/shared/domain/page';
import { AccountStatus, UserRole } from 'src/shared/domain/user-role';
import { ChangeRoleDTO } from './dto/change-role.dto';
import { UserDTO, UserPageDTO } from './dto/user.dto';
import { UsersQueryDTO } from './dto/users-query.dto';
import { UsersService } from './users.service';

// Gestión de cuentas por el administrador. «Mi cuenta» (/users/me) está en auth.
@ApiTags('Usuarios (administración)')
@Roles(UserRole.Admin)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Get()
    async findAll(@Query() query: UsersQueryDTO): Promise<UserPageDTO> {
        const { q, rol, estado } = query;
        return mapPage(await this.service.findPage(query, { q, rol, estado }), UserDTO.from);
    }

    @Patch(':id/block')
    async block(@CurrentUser() actor: AuthenticatedUser, @Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return UserDTO.from(await this.service.setStatus(actor.id, id, AccountStatus.Blocked));
    }

    @Patch(':id/unblock')
    async unblock(@CurrentUser() actor: AuthenticatedUser, @Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return UserDTO.from(await this.service.setStatus(actor.id, id, AccountStatus.Active));
    }

    @Patch(':id/role')
    async changeRole(
        @CurrentUser() actor: AuthenticatedUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangeRoleDTO,
    ): Promise<UserDTO> {
        return UserDTO.from(await this.service.setRole(actor.id, id, body.rol));
    }
}
