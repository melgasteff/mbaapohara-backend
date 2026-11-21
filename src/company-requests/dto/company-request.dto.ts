import { Transform } from 'class-transformer';
import { Equals, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { RequestStatus, RequestType } from '../company-request.entity';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** Solicitud pública de una empresa (POST /company-requests). */
export class CreateCompanyRequestDTO {
    /** `revision_resena` (con `idResena`) o `correccion_datos` (con `idEmpresa`). */
    @IsEnum(RequestType)
    tipo: RequestType;

    /** Reseña publicada que se pide revisar. */
    @IsOptional()
    @IsInt()
    @Min(1)
    idResena?: number;

    /** Empresa cuyos datos se piden corregir. */
    @IsOptional()
    @IsInt()
    @Min(1)
    idEmpresa?: number;

    /** Nombre de quien escribe en nombre de la empresa. Se borra al responder. */
    @Transform(trim)
    @IsString()
    @Length(2, 100)
    nombre: string;

    /** Correo para la respuesta. Se borra al responder. */
    @Transform(trim)
    @IsEmail()
    @MaxLength(254)
    correo: string;

    /** De 20 a 2.000 caracteres. */
    @Transform(trim)
    @IsString()
    @Length(20, 2000)
    mensaje: string;

    /** Aceptó la política de privacidad (se guardan nombre y correo mientras la solicitud está abierta). */
    @Equals(true)
    aceptaPrivacidad: boolean;
}

export class RequestReceivedDTO {
    mensaje: string;
}

/** Respuesta del administrador; cierra la solicitud y borra los datos de contacto. */
export class AnswerCompanyRequestDTO {
    /** Lo que se le respondió a la empresa por correo, de 10 a 2.000 caracteres. */
    @Transform(trim)
    @IsString()
    @Length(10, 2000)
    respuesta: string;
}

export class CompanyRequestsQueryDTO extends PaginationQueryDTO {
    @IsOptional()
    @IsEnum(RequestStatus)
    estado?: RequestStatus;
}

export class RequestReviewDTO {
    id: number;
    /** La reseña sigue publicada; si no, `loBueno` y `aMejorar` son `null`. */
    publicada: boolean;
    loBueno: string | null;
    aMejorar: string | null;
}

/** Solicitud para la administración. */
export class CompanyRequestDTO {
    id: number;
    tipo: RequestType;
    estado: RequestStatus;
    empresa: { id: number; nombre: string } | null;
    resena: RequestReviewDTO | null;
    /** Solo mientras está abierta. */
    nombre: string | null;
    correo: string | null;
    mensaje: string;
    respuesta: string | null;
    fecha: Date;
    fechaRespuesta: Date | null;
}

export class CompanyRequestPageDTO {
    data: CompanyRequestDTO[];
    total: number;
    page: number;
    pageSize: number;
}

