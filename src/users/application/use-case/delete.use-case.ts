import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserNotFoundException } from "../exception/user-not-found.exception";
import { UserInUseException } from "../exception/user-in-use.exception";

export class DeleteUserUseCase {
  constructor(
    private readonly userRepo: UserRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const user = await this.userRepo.getById(id);

      if (!user) {throw new UserNotFoundException(id); }

      await this.userRepo.delete(id);

    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      if (error instanceof Error && error.message.includes('foreign key'))  throw new UserInUseException(id);
      throw new error
    }
  }
}