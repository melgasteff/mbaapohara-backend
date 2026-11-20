import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { CompaniesService } from './companies.service';
import { AdminCompaniesQueryDTO, CompaniesQueryDTO } from './dto/companies-query.dto';
import { ProposalStatus } from './proposal-status';
import { CompanyDetailDTO, CompanyDTO, CompanyPageDTO } from './dto/company.dto';
import { ProposeCompanyDTO, SaveCompanyDTO } from './dto/save-company.dto';

// Lo público muestra solo empresas aprobadas; lo pendiente y lo rechazado se ve en GET /companies/admin.
@ApiTags('Empresas')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly service: CompaniesService) { }

    /** Directorio: empresas aprobadas. */
    @Public()
    @Get()
    async findAll(@Query() query: CompaniesQueryDTO): Promise<CompanyPageDTO> {
        const { q, rubro, ciudad } = query;
        return mapPage(await this.service.findPage(query, { q, rubro, ciudad, estado: ProposalStatus.Approved }), CompanyDTO.from);
    }

    /** Administración: empresas en cualquier estado. Va antes de «:id» para que «admin» no se lea como id. */
    @Roles(UserRole.Admin)
    @Get('admin')
    async findAllAdmin(@Query() query: AdminCompaniesQueryDTO): Promise<CompanyPageDTO> {
        const { q, estado } = query;
        return mapPage(await this.service.findPage(query, { q, estado }), CompanyDTO.from);
    }

    /** Empresa aprobada con sus locales aprobados. */
    @Public()
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

    @Roles(UserRole.Admin)

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: SaveCompanyDTO): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.update(id, body));
    }

    /** Aprueba una empresa pendiente y sus locales pendientes. */
    @Roles(UserRole.Admin)

    @Patch(':id/approve')
    async approve(@Param('id', ParseIntPipe) id: number): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.approve(id));
    }

    /** Rechaza una empresa pendiente y sus locales pendientes. */
    @Roles(UserRole.Admin)

    @Patch(':id/reject')
    async reject(@Param('id', ParseIntPipe) id: number): Promise<CompanyDTO> {
        return CompanyDTO.from(await this.service.reject(id));
    }

    @Roles(UserRole.Admin)

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
