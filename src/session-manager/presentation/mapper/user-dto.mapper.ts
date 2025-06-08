import { User } from "src/session-manager/domain/model/user.entity"
import { UserDTO } from "../dto/user.dto"


export class UserDTOMapper {
    static toDTO(user: User): UserDTO {
        return {
            email: user.getEmail(),
            contrasenha: user.getContrasenha(),
        }
    }

    static toDomain(userDto: UserDTO): User {
        return new User(
            userDto.email,
            userDto.contrasenha,
        )
    }
}