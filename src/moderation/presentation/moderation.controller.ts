import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { ModerationLog } from '../domain/port/moderation-log.port';
import { ModerationPort } from '../domain/port/moderation.port';
import { MODERATION_SETTINGS, ModerationSettings } from '../infrastructure/module/moderation-settings';
import { EvaluateTextDTO, SpendDTO, VerdictDTO } from './dto/moderation.dto';

// Endpoints de prueba y control, solo para administradores. Las reseñas (Fase 3) usan ModerationPort directamente.
@ApiTags('Moderación')
@Roles(UserRole.Admin)
@Controller('moderation')
export class ModerationController {
    constructor(
        private readonly moderation: ModerationPort,
        private readonly log: ModerationLog,
        @Inject(MODERATION_SETTINGS) private readonly settings: ModerationSettings,
    ) { }

    /** Modera un texto como si fuera una reseña y registra la decisión (sin reseña asociada). Lo usa la medición (2.4). */
    @Post('evaluate')
    @HttpCode(200)
    async evaluate(@Body() body: EvaluateTextDTO): Promise<VerdictDTO> {
        const v = await this.moderation.evaluate(body);
        return {
            resultado: v.outcome, categoria: v.category, mensaje: v.message, origen: v.origin, reglas: v.rules,
            confianzas: v.scores, falla: v.failure, modelo: v.model, versionInstruccion: v.promptVersion,
            motivoModelo: v.modelReason, costoUsd: v.costUsd,
        };
    }

    /** Gasto del clasificador en el mes en curso y tope configurado. */
    @Get('spend')
    async spend(): Promise<SpendDTO> {
        return {
            mes: new Date().toISOString().slice(0, 7),
            gastoUsd: await this.log.monthSpendUsd(),
            topeUsd: this.settings.monthlyBudgetUsd,
            modelo: this.settings.model,
            conClave: this.settings.hasApiKey,
        };
    }
}
