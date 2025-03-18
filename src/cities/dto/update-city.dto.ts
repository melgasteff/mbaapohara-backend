import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';
import { Country } from 'src/countries/entities/country.entity';

export class UpdateCityDto extends PartialType(CreateCityDto) {
    descripcion?: string
    pais?: Country
}
