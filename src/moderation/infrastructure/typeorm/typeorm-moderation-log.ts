import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verdict } from '../../domain/model/moderation';
import { ModerationLog } from '../../domain/port/moderation-log.port';
import { ModerationDecisionEntity } from './moderation-decision.entity';

/** Mes calendario en curso, en UTC: «2026-11». */
function currentMonth(): string {
    return new Date().toISOString().slice(0, 7);
}

@Injectable()
export class TypeOrmModerationLog extends ModerationLog {
    constructor(@InjectRepository(ModerationDecisionEntity) private readonly decisions: Repository<ModerationDecisionEntity>) {
        super();
    }

    async record(verdict: Verdict, textHash: string, reviewId: number | null): Promise<void> {
        await this.decisions.insert({
            idResena: reviewId,
            huellaTexto: textHash,
            resultado: verdict.outcome,
            categoria: verdict.category,
            origen: verdict.origin,
            reglas: verdict.rules,
            confianzas: verdict.scores,
            falla: verdict.failure,
            modelo: verdict.model,
            versionInstruccion: verdict.promptVersion,
            motivoModelo: verdict.modelReason,
            costoUsd: verdict.costUsd.toFixed(6),
        });
    }

    async monthSpendUsd(): Promise<number> {
        const rows: { costo_usd: string }[] = await this.decisions.query('SELECT costo_usd FROM gasto_moderacion WHERE mes = $1', [currentMonth()]);
        return rows.length ? Number(rows[0].costo_usd) : 0;
    }

    async addSpend(costUsd: number): Promise<void> {
        // Suma atómica: dos reseñas al mismo tiempo no pisan el total.
        await this.decisions.query(
            `INSERT INTO gasto_moderacion (mes, costo_usd, llamadas) VALUES ($1, $2, 1)
             ON CONFLICT (mes) DO UPDATE SET costo_usd = gasto_moderacion.costo_usd + EXCLUDED.costo_usd,
                                             llamadas = gasto_moderacion.llamadas + 1`,
            [currentMonth(), costUsd.toFixed(6)],
        );
    }
}
