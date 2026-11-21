import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';

// Valores de la API: los mismos que el JSON de criterios del frontend (public/criterios-provisionales.json).

export enum SituationValue {
    ACTUAL = 'ACTUAL',
    ANTERIOR = 'ANTERIOR',
}

export enum AnswerValue {
    SI = 'SI',
    EN_PARTE = 'EN_PARTE',
    NO = 'NO',
    NO_SABE = 'NO_SABE',
}

/** Contenido de una reseña al editarla (PUT /reviews/:id). Reemplaza la versión anterior completa. */
export class EditReviewDTO {
    /** Id de un cargo de la lista (GET /jobs). Va este o `cargoPropuesto`, no los dos. */
    @IsOptional()
    @IsInt()
    @Min(1)
    idCargo?: number;

    /** Cargo que no está en la lista; queda pendiente hasta que el administrador lo apruebe. */
    @IsOptional()
    @IsString()
    @MaxLength(80)
    cargoPropuesto?: string;

    @IsEnum(SituationValue)
    situacion: SituationValue;

    /** Último año en la empresa: obligatorio si `situacion` es ANTERIOR; con ACTUAL se ignora. */
    @IsOptional()
    @IsInt()
    ultimoAnio?: number | null;

    /** Id del tipo de contrato (GET /contract-types). */
    @IsInt()
    @Min(1)
    idTipoContrato: number;

    /** Id de la modalidad (GET /work-modes). */
    @IsInt()
    @Min(1)
    idModalidad: number;

    /** Calificación general, de 1 a 5 estrellas. */
    @IsInt()
    @Min(1)
    @Max(5)
    calificacion: number;

    /** De 50 a 1.000 caracteres, sin contar los espacios de los extremos. */
    @IsString()
    @MaxLength(5000)
    loBueno: string;

    /** De 50 a 1.000 caracteres, sin contar los espacios de los extremos. */
    @IsString()
    @MaxLength(5000)
    aMejorar: string;

    /** Respuesta de cada criterio activo, por código: `{ "CP01": "SI", "CP02": "NO_SABE" }`. Todos obligatorios. */
    @IsObject()
    respuestas: Record<string, AnswerValue>;
}

/** Reseña nueva (POST /reviews). */
export class PublishReviewDTO extends EditReviewDTO {
    /** Id del local (aprobado) que se reseña. */
    @IsInt()
    @Min(1)
    idLocal: number;
}

/** Filtros del listado público (GET /reviews), RF5. */
export class ReviewsQueryDTO extends PaginationQueryDTO {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    empresa?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    local?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    cargo?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    ciudad?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    tipoContrato?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    modalidad?: number;

    @IsOptional() @IsEnum(SituationValue)
    situacion?: SituationValue;
}
