import { IsEnum } from 'class-validator';
import { UserRole } from 'src/shared/domain/user-role';

export class ChangeRoleDTO {
    @IsEnum(UserRole)
    rol: UserRole;
}
