import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { Office } from 'src/offices/entities/office.entity';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    nombre?: string;
    rubro?: string;
    // offices?: Office[];
}
