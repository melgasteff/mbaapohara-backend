import { AutomaticSignals, ModerationCategory, ModerationOutcome } from 'src/moderation/domain/model/moderation';
import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { Page, PageRequest } from 'src/shared/domain/page';
import { ReviewStatus } from '../../domain/model/review';
import { QueueVersion } from '../../domain/model/review-views';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { InvalidReviewException, VersionAlreadyDecidedException, VersionNotFoundException } from '../exception/review.exceptions';

export const PUBLISHED_BY_REVIEW = 'Tu reseña ya está publicada.';
export const REASON_MIN = 10;
export const REASON_MAX = 500;

/** Versión de la cola con las señales de la moderación automática y el tiempo de espera. */
export interface QueueItem extends QueueVersion {
    /** Horas desde el envío; el objetivo es resolver en 48 (política, sección 6). */
    horasEsperando: number;
    senales: Omit<AutomaticSignals, 'versionId'> | null;
}

/** Cola de revisión humana: lo que quedó en revisión, con las señales que llevaron ahí. Nunca el autor. */
export class ListModerationQueueUseCase {
    constructor(
        private readonly repo: ReviewRepository,
        private readonly moderation: ModerationPort,
        private readonly now: () => Date = () => new Date(),
    ) { }

    async execute(page: PageRequest): Promise<Page<QueueItem>> {
        const result = await this.repo.listQueue(page);
        const signals = new Map((await this.moderation.signalsFor(result.data.map(v => v.idVersion))).map(s => [s.versionId, s]));
        const now = this.now().getTime();
        return {
            ...result,
            data: result.data.map(version => {
                const found = signals.get(version.idVersion);
                return {
                    ...version,
                    horasEsperando: Math.max(0, Math.floor((now - new Date(version.fechaEnvio).getTime()) / 3_600_000)),
                    senales: found
                        ? { category: found.category, rules: found.rules, scores: found.scores, failure: found.failure, modelReason: found.modelReason }
                        : null,
                };
            }),
        };
    }
}

/**
 * Decisión de la revisión humana (política, sección 6): publicar la versión o rechazarla con una categoría y un motivo
 * que lee quien escribió. Se aplica solo si la versión sigue en revisión, y queda en el registro con origen «persona».
 */
export class DecideReviewUseCase {
    constructor(private readonly repo: ReviewRepository, private readonly moderation: ModerationPort) { }

    async publish(adminId: number, versionId: number): Promise<{ idResena: number; estado: ReviewStatus }> {
        return this.decide(adminId, versionId, ModerationOutcome.Published, null, PUBLISHED_BY_REVIEW);
    }

    async reject(adminId: number, versionId: number, category: ModerationCategory, reason: string): Promise<{ idResena: number; estado: ReviewStatus }> {
        const message = reason.trim().replace(/\s+/g, ' ');
        if (message.length < REASON_MIN || message.length > REASON_MAX) {
            throw new InvalidReviewException([`El motivo tiene que tener entre ${REASON_MIN} y ${REASON_MAX} caracteres`]);
        }
        return this.decide(adminId, versionId, ModerationOutcome.Rejected, category, message);
    }

    private async decide(
        adminId: number, versionId: number, outcome: ModerationOutcome.Published | ModerationOutcome.Rejected,
        category: ModerationCategory | null, message: string,
    ): Promise<{ idResena: number; estado: ReviewStatus }> {
        const version = await this.repo.findVersion(versionId);
        if (!version) throw new VersionNotFoundException(versionId);
        // Los estados de la moderación y de la versión usan los mismos valores.
        const status = outcome as unknown as ReviewStatus;
        if (version.estado !== ReviewStatus.InReview || !(await this.repo.decideInReview(version.idResena, versionId, { status, category, message }))) {
            throw new VersionAlreadyDecidedException(versionId);
        }
        await this.moderation.recordHumanDecision(
            { loBueno: version.loBueno, aMejorar: version.aMejorar },
            { outcome, category, message, adminId },
            { reviewId: version.idResena, versionId },
        );
        return { idResena: version.idResena, estado: status };
    }
}
