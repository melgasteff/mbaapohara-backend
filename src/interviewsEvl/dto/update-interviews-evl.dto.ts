import { PartialType } from '@nestjs/mapped-types';
import { CreateInterviewsEvlDto } from './create-interviews-evl.dto';

export class UpdateInterviewsEvlDto extends PartialType(CreateInterviewsEvlDto) {
    calificacion?: number;
    dificultad?: string;
}
