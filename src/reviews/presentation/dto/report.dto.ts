import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { REPORT_CATEGORIES, ReportCategory } from '../../domain/model/report';
import { NamedRefDTO, OfficeRefDTO } from './review-response.dto';

/** Reporte de una reseña publicada (POST /reviews/:id/reports). */
export class ReportReviewDTO {
    /** Categoría de la política (DP, TER, ACU, INS, SPAM, TEMA) u OTRO. */
    @IsIn(REPORT_CATEGORIES)
    categoria: ReportCategory;

    /** Obligatorio con OTRO; hasta 500 caracteres. */
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(500)
    comentario?: string;
}

export class ReportReceivedDTO {
    mensaje: string;
}

export class ReportEntryDTO {
    categoria: string;
    comentario: string | null;
    fecha: Date;
}

/** Reseña con reportes pendientes. Sin el autor ni quién reportó. */
export class ReportedReviewDTO {
    idResena: number;
    empresa: NamedRefDTO;
    local: OfficeRefDTO;
    publicada: boolean;
    calificacion: number | null;
    loBueno: string | null;
    aMejorar: string | null;
    cantidad: number;
    primerReporte: Date;
    reportes: ReportEntryDTO[];
}

export class ReportedReviewPageDTO {
    data: ReportedReviewDTO[];
    total: number;
    page: number;
    pageSize: number;
}

export class ReportsClosedDTO {
    reportesCerrados: number;
}

export class RetiredDTO {
    idResena: number;
    reportesCerrados: number;
}
