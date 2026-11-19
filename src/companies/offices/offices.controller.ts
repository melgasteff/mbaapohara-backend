import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { OfficeDTO, OfficePageDTO } from './dto/office.dto';
import { SaveOfficeDTO } from './dto/save-office.dto';
import { OfficesService } from './offices.service';

// Hasta la tarea 1.5 no hay autenticación: editar, aprobar, rechazar y borrar serán solo del administrador.
@ApiTags('Empresas')
@Controller()
export class OfficesController {
    constructor(private readonly service: OfficesService) { }

    /** Locales aprobados de una empresa. */
    @Public()

    @Get('companies/:id/offices')
    async findByCompany(@Param('id', ParseIntPipe) id: number, @Query() query: PaginationQueryDTO): Promise<OfficePageDTO> {
        return mapPage(await this.service.findByCompany(id, query), OfficeDTO.from);
    }

    /** Propone un local nuevo para una empresa. Queda pendiente de aprobación. */
    @Post('companies/:id/offices')
    async propose(@Param('id', ParseIntPipe) id: number, @Body() body: SaveOfficeDTO): Promise<OfficeDTO> {
        return OfficeDTO.from(await this.service.propose(id, body));
    }

    @Public()

    @Get('offices/:id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<OfficeDTO> {
        return OfficeDTO.from(await this.service.findOne(id));
    }

    @Roles(UserRole.Admin)

    @Put('offices/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: SaveOfficeDTO): Promise<OfficeDTO> {
        return OfficeDTO.from(await this.service.update(id, body));
    }

    /** Aprueba un local pendiente. Su empresa tiene que estar aprobada. */
    @Roles(UserRole.Admin)

    @Patch('offices/:id/approve')
    async approve(@Param('id', ParseIntPipe) id: number): Promise<OfficeDTO> {
        return OfficeDTO.from(await this.service.approve(id));
    }

    @Roles(UserRole.Admin)

    @Patch('offices/:id/reject')
    async reject(@Param('id', ParseIntPipe) id: number): Promise<OfficeDTO> {
        return OfficeDTO.from(await this.service.reject(id));
    }

    @Roles(UserRole.Admin)

    @Delete('offices/:id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
