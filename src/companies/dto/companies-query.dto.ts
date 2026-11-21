import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { ProposalStatus } from 'src/shared/domain/proposal-status';

// Directorio público (GET /companies): solo empresas aprobadas.
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
}

// Listado de administración (GET /companies/admin): empresas en cualquier estado.
export class AdminCompaniesQueryDTO extends PaginationQueryDTO {
    /** Parte del nombre; no distingue mayúsculas ni tildes. */
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(100)
    q?: string;

    /** Estado de la empresa. Sin este filtro, todas. */
    @IsOptional()
    @IsEnum(ProposalStatus)
    estado?: ProposalStatus;
}
