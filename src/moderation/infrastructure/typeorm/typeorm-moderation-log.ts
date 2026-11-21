import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomaticSignals, HumanDecision, Verdict } from '../../domain/model/moderation';
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

    async record(verdict: Verdict, textHash: string, reviewId: number | null, versionId: number | null = null): Promise<void> {
        await this.decisions.insert({
            idResena: reviewId,
            idVersionResena: versionId,
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

    async recordHuman(decision: HumanDecision, textHash: string, reviewId: number, versionId: number): Promise<void> {
        await this.decisions.insert({
            idResena: reviewId,
            idVersionResena: versionId,
            huellaTexto: textHash,
            resultado: decision.outcome,
            categoria: decision.category,
            origen: 'persona',
            idAdministrador: decision.adminId,
            motivoDecision: decision.message,
        });
    }

    signalsFor(versionIds: number[]): Promise<AutomaticSignals[]> {
        // La última decisión automática de cada versión; las humanas no cuentan como señal.
        return this.decisions.query(
            `SELECT DISTINCT ON (id_version_resena)
                    id_version_resena AS "versionId", categoria AS category, reglas AS rules, confianzas AS scores,
                    falla AS failure, motivo_modelo AS "modelReason"
             FROM decisiones_moderacion
             WHERE id_version_resena = ANY($1) AND origen <> 'persona'
             ORDER BY id_version_resena, fecha DESC, id DESC`,
            [versionIds]);
    }
}
