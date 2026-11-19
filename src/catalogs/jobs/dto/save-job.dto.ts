import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Cuerpo para crear o renombrar un cargo.
export class SaveJobDTO {
    /** Nombre del cargo, por ejemplo «Cajero». */
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    descripcion: string;
}
