import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

const clean = ({ value }) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value);

// Datos de un local, para proponerlo o editarlo.
export class SaveOfficeDTO {
    /** Nombre del local, por ejemplo «Casa central» o «Shopping del Sol». */
    @Transform(clean)
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombre: string;

    /** Id de la ciudad (catálogo /cities). */
    @IsInt()
    @Min(1)
    idCiudad: number;

    /** Referencia opcional para ubicar el local, por ejemplo «Avda. España casi Brasil». */
    @IsOptional()
    @Transform(clean)
    @IsString()
    @MaxLength(200)
    direccionReferencia?: string;
}
