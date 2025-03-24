import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyReviewDto } from './create-company-review.dto';

export class UpdateCompanyReviewDto extends PartialType(CreateCompanyReviewDto) {
    activo?: boolean;
    pros?: string;
    consejo?: string;
    calificacion?: number;
    contras?: string;
    titulo?: string;
    modaildad?: string;

}
