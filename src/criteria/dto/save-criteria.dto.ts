import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const code = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toUpperCase() : value);
const CODE = /^[A-Z0-9_]{2,30}$/;
const CODE_MESSAGE = 'El código lleva de 2 a 30 letras sin tildes, números o guiones bajos (por ejemplo, CP10)';

/** Alta de una categoría. */
export class CreateCategoryDTO {
    /** Código estable, por ejemplo «CONTRATACION_PAGOS». No se puede cambiar después. */
    @Transform(code)
    @IsString()
    @Matches(CODE, { message: CODE_MESSAGE })
    codigo: string;

    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    /** Posición entre las categorías. Sin este campo, va al final. */
    @IsOptional()
    @IsInt()
    @Min(0)
    orden?: number;
}

/** Cambio de una categoría: nombre, orden o estado. El código no cambia. */
export class UpdateCategoryDTO {
    @IsOptional()
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    orden?: number;

    /** `false` la oculta con todos sus ítems; no se borra nada. */
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}

/** Alta de un ítem dentro de una categoría. */
export class CreateCriterionDTO {
    /** Código estable, por ejemplo «CP10». No se puede cambiar después. */
    @Transform(code)
    @IsString()
    @Matches(CODE, { message: CODE_MESSAGE })
    codigo: string;

    /** Afirmación que se responde con Sí / En parte / No / No sé. */
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    texto: string;

    @IsInt()
    idCategoria: number;

    /** Posición dentro de la categoría. Sin este campo, va al final. */
    @IsOptional()
    @IsInt()
    @Min(0)
    orden?: number;
}

/** Cambio de un ítem: texto, orden o estado. El código y la categoría no cambian. */
export class UpdateCriterionDTO {
    /** Corregir la redacción. Para cambiar el sentido, crear otro ítem y desactivar este. */
    @IsOptional()
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    texto?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    orden?: number;

    /** `false` deja de pedirlo en las reseñas y de mostrarlo; las respuestas viejas se conservan. */
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
