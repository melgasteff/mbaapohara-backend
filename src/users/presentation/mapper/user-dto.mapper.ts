import { User } from "src/users/domain/model/user.entity"
import { UserDTO } from "../dto/user.dto"
import { UserResponseDTO } from "../dto/user-response.dto"

export class UserDTOMapper {
    static toDTO(user: User): UserResponseDTO {
        return {
            id: user.getId(),
            nombre: user.getNombre(),
            apellido: user.getApellido(),
            usuario: user.getUsuario(),
            email: user.getEmail(),
            idciudad: user.getCiudad(),
            tipoUsuario: user.getTipoUsuario(),
            descripcion: user.getDescripcion()
        }
    }

    static toDomain(userDto: UserDTO): User {
        return new User(
            userDto.id,
            userDto.nombre,
            userDto.apellido,
            userDto.usuario,
            userDto.email,
            userDto.contrasenha,
            userDto.idciudad,
            userDto.tipoUsuario,
            userDto.descripcion
        )
    }
}