import { Transform, Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { SaveOfficeDTO } from '../offices/dto/save-office.dto';

const clean = ({ value }) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value);

// Datos de la empresa, para editarla (administrador).
export class SaveCompanyDTO {
    /** Nombre comercial, por ejemplo «Superseis». */
    @Transform(clean)
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    nombre: string;

    /** Id del rubro (catálogo /sectors). */
    @IsInt()
    @Min(1)
    idRubro: number;
}

// Propuesta de una empresa nueva: se crea pendiente, junto con su primer local (D10).
export class ProposeCompanyDTO extends SaveCompanyDTO {
    /** Primer local de la empresa. */
    @IsDefined()
    @ValidateNested()
    @Type(() => SaveOfficeDTO)
    local: SaveOfficeDTO;
}
