import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AccountStatus, UserRole } from 'src/shared/domain/user-role';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';

export class UsersQueryDTO extends PaginationQueryDTO {
    /** Parte del email. */
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(100)
    q?: string;

    @IsOptional()
    @IsEnum(UserRole)
    rol?: UserRole;

    @IsOptional()
    @IsEnum(AccountStatus)
    estado?: AccountStatus;
}
