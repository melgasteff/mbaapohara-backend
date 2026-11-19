import { Transform } from 'class-transformer';
import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';
import { AccountStatus, UserRole } from 'src/shared/domain/user-role';

const normalizeEmail = ({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);

export class RegisterDTO {
    @Transform(normalizeEmail)
    @IsEmail({}, { message: 'El email no es válido' })
    @MaxLength(254)
    email: string;

    /** Al menos 8 caracteres, con mayúscula, minúscula, número y símbolo. Máximo 72 (límite de bcrypt). */
    @IsString()
    @IsStrongPassword(
        { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
        { message: 'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo' },
    )
    @MaxLength(72)
    password: string;

    /** Aceptación de los términos y la política de privacidad. Tiene que ser true. */
    @IsBoolean()
    @Equals(true, { message: 'Hay que aceptar los términos y la política de privacidad' })
    aceptaTerminos: boolean;
}

export class LoginDTO {
    @Transform(normalizeEmail)
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(72)
    password: string;
}

export class TokenDTO {
    /** Token de acceso. Se envía en la cabecera Authorization: Bearer <token>. */
    accessToken: string;
    tokenType: 'Bearer';
    /** Vigencia del token, por ejemplo «2h». */
    expiresIn: string;
}

export class DeleteAccountDTO {
    /** Contraseña actual, para confirmar. */
    @IsString()
    @IsNotEmpty()
    @MaxLength(72)
    password: string;
}

export class AccountDTO {
    id: number;
    email: string;
    rol: UserRole;
    estado: AccountStatus;
    fechaConsentimiento: Date | null;
    fechaCreacion: Date;
}
