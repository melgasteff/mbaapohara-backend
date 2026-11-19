import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { ProposalStatus } from '../proposal-status';

export class CompaniesQueryDTO extends PaginationQueryDTO {
    /** Parte del nombre; no distingue mayúsculas ni tildes. */
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(100)
    q?: string;

    /** Id del rubro (catálogo /sectors). */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    rubro?: number;

    /** Id de la ciudad: empresas con al menos un local aprobado en ella. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    ciudad?: number;

    /** Estado de la empresa. Por defecto, solo las aprobadas. */
    @IsOptional()
    @IsEnum(ProposalStatus)
    estado?: ProposalStatus;
}
