import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { CompanyOrder } from '../company-directory.service';
import { SectorGroup } from '../sector-groups';

// Filtros del directorio público: solo empresas aprobadas. Los usan el listado y sus facetas.
export class CompanyFiltersDTO {
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

    /** Grupo de rubro. */
    @IsOptional()
    @IsEnum(SectorGroup)
    grupo?: SectorGroup;

    /** Id del departamento: empresas con al menos un local aprobado en él. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    departamento?: number;

    /** Id de la ciudad: empresas con al menos un local aprobado en ella. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    ciudad?: number;

    /** `true`: solo con reseñas publicadas; `false`: solo sin reseñas. Sin este filtro, todas. */
    @IsOptional()
    @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
    @IsBoolean()
    conResenas?: boolean;
}

// Directorio público (GET /companies).
export class CompaniesQueryDTO extends IntersectionType(PaginationQueryDTO, CompanyFiltersDTO) {
    @IsOptional()
    @IsEnum(CompanyOrder)
    orden: CompanyOrder = CompanyOrder.Nombre;
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
