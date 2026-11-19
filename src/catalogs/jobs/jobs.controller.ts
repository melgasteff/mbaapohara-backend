import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { JobDTO, JobPageDTO } from './dto/job.dto';
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

    @Roles(UserRole.Admin)

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
