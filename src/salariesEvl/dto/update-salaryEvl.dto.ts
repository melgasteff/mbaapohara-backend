import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryEvlDto } from './create-salaryEvl.dto';

export class UpdateSalaryEvlDto extends PartialType(CreateSalaryEvlDto) {
    base?: string;
    bono?: string;
    experiencia_area?: string;
    experiencia_empresa?: string;
    propina?: string;
    comision?: string;
    modalidad?: string;
    moneda?: string;
    frecuencia?: string;
}
