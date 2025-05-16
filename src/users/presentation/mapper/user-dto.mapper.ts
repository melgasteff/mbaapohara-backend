import { User } from "src/users/domain/model/user.entity"
import { UserDTO } from "../dto/user.dto"

export class UserDTOMapper {
    static toDTO(user: User): UserDTO {
        console.log("user to dto", user.getNombre(), "descripcion",user.getDescripcion())
        return {
            id: user.getId(),
            nombre: user.getNombre(),
            apellido: user.getApellido(),
            usuario: user.getUsuario(),
            email: user.getEmail(),
            contrasenha: user.getContrasenha(),
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