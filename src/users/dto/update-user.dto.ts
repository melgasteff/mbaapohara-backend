import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { City } from 'src/cities1/entities/city.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    nombre?: string
    apellido?: string
    usuario?: string
    email?: string
    contrasena?: string
    tipo_usuario?: string
    ciudad?: City
    descripcion?: string;
}
