import { InvalidReviewException } from '../application/exception/review.exceptions';
import { SubmitResult } from '../application/use-case/review-steps';
import { CriterionAnswer, ReviewInput, WorkSituation } from '../domain/model/review';
import { AnswerView, MyReview, PublicReview, PublicReviewFilters } from '../domain/model/review-views';
import { AnswerDTO, MyReviewDTO, PublicReviewDTO, SubmitResultDTO } from './dto/review-response.dto';
import { QueueItemDTO } from './dto/moderation-queue.dto';
import { QueueItem } from '../application/use-case/moderation-queue.use-case';
import { AnswerValue, EditReviewDTO, ReviewsQueryDTO, SituationValue } from './dto/review.dto';

// Traduce entre los valores de la API (los del JSON del frontend) y los del dominio (los de la base).

const SITUATION_IN: Record<SituationValue, WorkSituation> = {
    [SituationValue.ACTUAL]: WorkSituation.Current,
    [SituationValue.ANTERIOR]: WorkSituation.Former,
};
const SITUATION_OUT: Record<WorkSituation, SituationValue> = {
    [WorkSituation.Current]: SituationValue.ACTUAL,
    [WorkSituation.Former]: SituationValue.ANTERIOR,
};
const ANSWER_IN: Record<AnswerValue, CriterionAnswer> = {
    [AnswerValue.SI]: CriterionAnswer.Yes,
    [AnswerValue.EN_PARTE]: CriterionAnswer.Partly,
    [AnswerValue.NO]: CriterionAnswer.No,
    [AnswerValue.NO_SABE]: CriterionAnswer.DontKnow,
};
const ANSWER_OUT = Object.fromEntries(Object.entries(ANSWER_IN).map(([api, domain]) => [domain, api])) as Record<CriterionAnswer, AnswerValue>;

export function toReviewInput(dto: EditReviewDTO): ReviewInput {
    const problems: string[] = [];
    const hasId = dto.idCargo !== undefined && dto.idCargo !== null;
    const hasProposal = typeof dto.cargoPropuesto === 'string' && dto.cargoPropuesto.trim() !== '';
    if (hasId === hasProposal) problems.push('Elegí un cargo de la lista o proponé uno nuevo, no los dos');

    const answers: Record<string, CriterionAnswer> = {};
    for (const [code, value] of Object.entries(dto.respuestas)) {
        const answer = ANSWER_IN[value as AnswerValue];
        if (answer) answers[code] = answer;
        else problems.push(`Respuesta inválida para ${code}: usá SI, EN_PARTE, NO o NO_SABE`);
    }
    if (problems.length) throw new InvalidReviewException(problems);

    return {
        job: hasId ? { id: dto.idCargo as number } : { proposed: dto.cargoPropuesto as string },
        situation: SITUATION_IN[dto.situacion],
        lastYear: dto.ultimoAnio ?? null,
        contractTypeId: dto.idTipoContrato,
        workModeId: dto.idModalidad,
        rating: dto.calificacion,
        loBueno: dto.loBueno,
        aMejorar: dto.aMejorar,
        answers,
    };
}

export function toFilters(query: ReviewsQueryDTO): PublicReviewFilters {
    return {
        companyId: query.empresa,
        officeId: query.local,
        jobId: query.cargo,
        cityId: query.ciudad,
        contractTypeId: query.tipoContrato,
        workModeId: query.modalidad,
        situation: query.situacion ? SITUATION_IN[query.situacion] : undefined,
    };
}

const toAnswers = (answers: AnswerView[]): AnswerDTO[] => answers.map(a => ({ codigo: a.codigo, respuesta: ANSWER_OUT[a.respuesta] }));

export function toSubmitResultDTO(result: SubmitResult): SubmitResultDTO {
    return {
        id: result.id,
        estado: result.estado,
        ...(result.categoria ? { categoria: result.categoria } : {}),
        ...(result.motivo ? { motivo: result.motivo } : {}),
    };
}

export function toPublicReviewDTO(review: PublicReview): PublicReviewDTO {
    return { ...review, situacion: SITUATION_OUT[review.situacion], respuestas: toAnswers(review.respuestas) };
}

export function toMyReviewDTO(review: MyReview): MyReviewDTO {
    const v = review.ultimaVersion;
    return { ...review, ultimaVersion: { ...v, situacion: SITUATION_OUT[v.situacion], respuestas: toAnswers(v.respuestas) } };
}

export function toQueueItemDTO(item: QueueItem): QueueItemDTO {
    return { ...item, situacion: SITUATION_OUT[item.situacion], respuestas: toAnswers(item.respuestas) };
}
