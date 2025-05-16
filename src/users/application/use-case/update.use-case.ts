import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserNotFoundException } from "../exception/user-not-found.exception";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository) { }

  async execute(id: number, user: User): Promise<User> {
    try {
      const allUsers = await this.userRepo.getAll();

      const userFound = allUsers.find((repeatedUser) => repeatedUser.getId() === id);

      if (!userFound) { throw new UserNotFoundException(id); }

      return this.userRepo.update(id, user)
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new error
    }

  }
}
