import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

const trim = ({ value }) => (typeof value === 'string' ? value.trim() : value);

/** Texto a moderar: los dos campos de la reseña (R6). */
export class EvaluateTextDTO {
    /** «Lo bueno», hasta 1.000 caracteres. */
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    loBueno: string;

    /** «A mejorar», hasta 1.000 caracteres. */
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    aMejorar: string;
}

export class VerdictDTO {
    /** publicada, en_revision o rechazada. */
    resultado: string;
    /** Categoría que motivó el rechazo o la revisión (DP, TER, ACU, INS, SPAM, TEMA). */
    categoria: string | null;
    /** Mensaje para quien escribió la reseña. */
    mensaje: string;
    /** «reglas» o «modelo». */
    origen: string;
    reglas: string[];
    /** Confianza de 0 a 1 por categoría; null si no se consultó el modelo. */
    confianzas: Record<string, number> | null;
    /** Por qué no hubo clasificación del modelo: sin_clave, tope_de_gasto, error, rechazo_del_modelo, respuesta_invalida. */
    falla: string | null;
    modelo: string | null;
    versionInstruccion: string | null;
    /** Motivo breve del modelo, para quien modera. */
    motivoModelo: string | null;
    costoUsd: number;
}

export class SpendDTO {
    /** Mes en curso, «AAAA-MM». */
    mes: string;
    gastoUsd: number;
    topeUsd: number;
    modelo: string;
    /** Si hay una clave de la API configurada; sin clave, todo va a revisión humana. */
    conClave: boolean;
}
