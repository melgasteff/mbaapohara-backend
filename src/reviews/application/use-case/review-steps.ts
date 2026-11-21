import { ModerationPort } from 'src/moderation/domain/port/moderation.port';
import { ReviewContent, ReviewInput, ReviewStatus, validateReview } from '../../domain/model/review';
import { ReviewReferences } from '../../domain/port/review-references.port';
import { ReviewRepository } from '../../domain/port/review-repository.port';
import { InvalidReviewException } from '../exception/review.exceptions';

// Pasos comunes a publicar y editar una reseña.

/** Resultado de un envío, para la persona que lo hizo. */
export interface SubmitResult {
    id: number;
    estado: ReviewStatus;
    categoria: string | null;
    motivo: string | null;
}

/** Valida la forma de la reseña (R2 a R7) y que existan el cargo, el contrato, la modalidad y los criterios. */
export async function validateContent(refs: ReviewReferences, input: ReviewInput, now: Date): Promise<ReviewContent> {
    const [criteria, jobOk, contractOk, modeOk] = await Promise.all([
        refs.activeCriteria(),
        'id' in input.job ? refs.isJobAvailable(input.job.id) : Promise.resolve(true),
        refs.contractTypeExists(input.contractTypeId),
        refs.workModeExists(input.workModeId),
    ]);
    const result = validateReview(input, criteria, now.getFullYear());
    const problems = [...result.problems];
    if (!jobOk) problems.push('El cargo elegido no existe');
    if (!contractOk) problems.push('El tipo de contrato elegido no existe');
    if (!modeOk) problems.push('La modalidad elegida no existe');
    if (problems.length || !result.content) throw new InvalidReviewException(problems);
    return result.content;
}

/**
 * Modera la versión recién guardada y aplica la decisión. Se llama fuera de la transacción que guardó la versión,
 * porque el clasificador puede tardar: si algo falla acá, la versión ya está guardada «en revisión» y la revisa
 * una persona (política, sección 5).
 */
export async function moderateVersion(
    moderation: ModerationPort, repo: ReviewRepository, reviewId: number, versionId: number, content: ReviewContent,
): Promise<SubmitResult> {
    const verdict = await moderation.evaluate({ loBueno: content.loBueno, aMejorar: content.aMejorar }, { reviewId, versionId });
    // Los estados de la moderación y de la versión usan los mismos valores (política, sección 7).
    const status = verdict.outcome as unknown as ReviewStatus;
    await repo.applyDecision(reviewId, versionId, { status, category: verdict.category, message: verdict.message });
    return {
        id: reviewId,
        estado: status,
        categoria: verdict.category,
        motivo: status === ReviewStatus.Published ? null : verdict.message,
    };
}
