import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { AdminJobDTO, AdminJobPageDTO, AdminJobsQueryDTO, JobDTO, JobPageDTO } from './dto/job.dto';
import { SaveJobDTO } from './dto/save-job.dto';
import { JobsService } from './jobs.service';

// Alta, cambio y baja quedan para el administrador cuando exista la autenticación (tarea 1.5).
@ApiTags('Catálogos')
@Controller('jobs')
export class JobsController {
    constructor(private readonly service: JobsService) { }

    @Public()

    @Get()
    async findAll(@Query() query: PaginationQueryDTO): Promise<JobPageDTO> {
        return mapPage(await this.service.findPage(query), JobDTO.from);
    }

    /** Administración: cargos en cualquier estado. Va antes de «:id» para que «admin» no se lea como id. */
    @Roles(UserRole.Admin)
    @Get('admin')
    async findAllAdmin(@Query() query: AdminJobsQueryDTO): Promise<AdminJobPageDTO> {
        return mapPage(await this.service.findAdminPage(query, query.estado), AdminJobDTO.fromAdmin);
    }

    @Public()

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<JobDTO> {
        return JobDTO.from(await this.service.findOne(id));
    }

    @Roles(UserRole.Admin)

    @Post()
    async create(@Body() body: SaveJobDTO): Promise<JobDTO> {
        return JobDTO.from(await this.service.create(body.descripcion));
    }

    @Roles(UserRole.Admin)

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: SaveJobDTO): Promise<JobDTO> {
        return JobDTO.from(await this.service.update(id, body.descripcion));
    }

    /** Aprueba un cargo propuesto desde una reseña (3.9a). */
    @Roles(UserRole.Admin)
    @Patch(':id/approve')
    async approve(@Param('id', ParseIntPipe) id: number): Promise<AdminJobDTO> {
        return AdminJobDTO.fromAdmin(await this.service.approve(id));
    }

    /** Rechaza un cargo propuesto: sus reseñas siguen mostrando «Otro cargo». */
    @Roles(UserRole.Admin)
    @Patch(':id/reject')
    async reject(@Param('id', ParseIntPipe) id: number): Promise<AdminJobDTO> {
        return AdminJobDTO.fromAdmin(await this.service.reject(id));
    }

    @Roles(UserRole.Admin)

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
