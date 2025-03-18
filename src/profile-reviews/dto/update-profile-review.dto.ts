import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileReviewDto } from './create-profile-review.dto';

export class UpdateProfileReviewDto extends PartialType(CreateProfileReviewDto) {
    costo?: number;
    calidad?: number;
    atencion?: number;
    comentario?: string;
}
