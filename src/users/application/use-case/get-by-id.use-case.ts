import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserNotFoundException } from "../exception/user-not-found.exception";

export class GetUserByIdUseCase {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async execute(id: number): Promise<User> {
        const userFound = await this.userRepo.getById(id)
        if (!userFound) throw new UserNotFoundException(id)
        return userFound
    

    }
}