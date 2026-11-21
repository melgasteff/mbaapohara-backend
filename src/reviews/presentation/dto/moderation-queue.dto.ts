import { Transform } from 'class-transformer';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ModerationCategory } from 'src/moderation/domain/model/moderation';
import { ReviewStatus } from '../../domain/model/review';
import { AnswerDTO, NamedRefDTO, OfficeRefDTO } from './review-response.dto';
import { SituationValue } from './review.dto';

/** Rechazo de la revisión humana: la categoría y el motivo que va a leer quien escribió. */
export class RejectVersionDTO {
    @IsEnum(ModerationCategory)
    categoria: ModerationCategory;

    /** De 10 a 500 caracteres. Conviene decir qué corregir (política, sección 7). */
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    motivo: string;
}

export class QueueSignalsDTO {
    /** Categoría que motivó la revisión, si la hubo. */
    category: string | null;
    /** Reglas locales que saltaron (datos_contacto, lista_insultos, texto_repetido). */
    rules: string[];
    /** Confianza de 0 a 1 por categoría, si respondió el modelo. */
    scores: Record<string, number> | null;
    /** Por qué no hubo clasificación del modelo (sin_clave, tope_de_gasto, error…). */
    failure: string | null;
    /** Frase breve del modelo para quien modera. */
    modelReason: string | null;
}

export class QueueItemDTO {
    idVersion: number;
    idResena: number;
    numero: number;
    empresa: NamedRefDTO;
    local: OfficeRefDTO;
    cargo: { descripcion: string; aprobado: boolean };
    situacion: SituationValue;
    ultimoAnio: number | null;
    tipoContrato: NamedRefDTO;
    modalidad: NamedRefDTO;
    calificacion: number;
    loBueno: string;
    aMejorar: string;
    respuestas: AnswerDTO[];
    fechaEnvio: Date;
    horasEsperando: number;
    tieneVersionPublicada: boolean;
    senales: QueueSignalsDTO | null;
}

export class QueuePageDTO {
    data: QueueItemDTO[];
    total: number;
    page: number;
    pageSize: number;
}

export class DecisionResultDTO {
    idResena: number;
    estado: ReviewStatus;
}
