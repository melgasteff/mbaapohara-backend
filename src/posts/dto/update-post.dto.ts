import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { User } from 'src/users/entities/user.entity';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    descripcion?: string;
    activo?: string
    calificacion?: number
    telefono?: string
    email?: string
    rubro?: string
    servicio?: string
    autor?: User
}
