import { PartialType } from '@nestjs/mapped-types';
import { CreateOfficeDto } from './create-office.dto';
import { Company } from 'src/companies/entities/company.entity';
import { City } from 'src/cities1/entities/city.entity';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {
    telefono?: string;
    cantidad_empleados?: number;
    email?: string;
    empresa?: Company;
    ciudad?: City;
}
