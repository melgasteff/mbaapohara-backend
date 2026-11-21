import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthenticatedUser } from 'src/auth/domain/model/auth-account';
import { CurrentUser, Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { CompanyRequestsService } from './company-requests.service';
import {
    AnswerCompanyRequestDTO, CompanyRequestPageDTO, CompanyRequestsQueryDTO, CreateCompanyRequestDTO, RequestReceivedDTO,
} from './dto/company-request.dto';

// Formulario público para empresas: sin cuenta (D5), con límite de 3 envíos por hora por IP.
@ApiTags('Solicitudes de empresas')
@Controller('company-requests')
export class CompanyRequestsController {
    constructor(private readonly service: CompanyRequestsService) { }

    /** Pide revisar una reseña o corregir los datos de la empresa. Se evalúa con la política de moderación. */
    @Public()
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 3, ttl: 3_600_000 } })
    @Post()
    @HttpCode(201)
    async create(@Body() body: CreateCompanyRequestDTO): Promise<RequestReceivedDTO> {
        await this.service.create(body);
        return { mensaje: 'Recibimos tu solicitud. Te respondemos por correo.' };
    }
}

// Bandeja de solicitudes, solo para administradores.
@ApiTags('Solicitudes de empresas')
@Roles(UserRole.Admin)
@Controller('moderation/company-requests')
export class CompanyRequestsAdminController {
    constructor(private readonly service: CompanyRequestsService) { }

    /** Solicitudes, las abiertas primero. Nombre y correo solo en las abiertas. */
    @Get()
    list(@Query() query: CompanyRequestsQueryDTO): Promise<CompanyRequestPageDTO> {
        return this.service.findPage(query, query.estado);
    }

    /** Registra la respuesta enviada por correo y cierra la solicitud: se borran el nombre y el correo. */
    @Patch(':id/answer')
    @HttpCode(204)
    answer(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseIntPipe) id: number, @Body() body: AnswerCompanyRequestDTO): Promise<void> {
        return this.service.answer(id, admin.id, body.respuesta);
    }
}
