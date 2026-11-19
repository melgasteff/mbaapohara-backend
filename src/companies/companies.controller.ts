import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { CompaniesService } from './companies.service';
import { CompaniesQueryDTO } from './dto/companies-query.dto';
import { CompanyDetailDTO, CompanyDTO, CompanyPageDTO } from './dto/company.dto';
import { ProposeCompanyDTO, SaveCompanyDTO } from './dto/save-company.dto';

// Hasta la tarea 1.5 no hay autenticación: editar, aprobar, rechazar y borrar serán solo del administrador.
@ApiTags('Empresas')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly service: CompaniesService) { }

    @Get()
    async findAll(@Query() query: CompaniesQueryDTO): Promise<CompanyPageDTO> {
        const { q, rubro, ciudad, estado } = query;
        return mapPage(await this.service.findPage(query, { q, rubro, ciudad, estado }), CompanyDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CompanyDetailDTO> {
        const { company, offices } = await this.service.findDetail(id);
        return CompanyDetailDTO.fromDetail(company, offices);
    }

    /** Propone una empresa nueva con su primer local. Ambos quedan pendientes de aprobación. */
    @Post()
    async propose(@Body() body: ProposeCompanyDTO): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.propose(body));
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: SaveCompanyDTO): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.update(id, body));
    }

    /** Aprueba una empresa pendiente y sus locales pendientes. */
    @Patch(':id/approve')
    async approve(@Param('id', ParseIntPipe) id: number): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.approve(id));
    }

    /** Rechaza una empresa pendiente y sus locales pendientes. */
    @Patch(':id/reject')
    async reject(@Param('id', ParseIntPipe) id: number): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.reject(id));
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
