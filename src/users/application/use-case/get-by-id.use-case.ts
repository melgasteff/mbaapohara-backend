import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserNotFoundException } from "../exception/user-not-found.exception";

export class GetUserByIdUseCase {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async execute(id: number): Promise<User> {
        try {
            const userFound = await this.userRepo.getById(id)
            if (!userFound) throw new UserNotFoundException(id)
            return userFound
        } catch (error) {
            console.error("Error al obtener el usuario", error);
            throw error;
        }

    }
}