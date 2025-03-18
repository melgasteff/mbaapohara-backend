import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUser } from './use-cases/create.use-case';
import { UpdateUser } from './use-cases/update.use-case';
import { DeleteUser } from './use-cases/delete.use-case';
import { GetUserById } from './use-cases/getById.use-case';
import { GetAllUsers } from './use-cases/getAllUsers.use-case';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUC: CreateUser,
    private readonly updateUserUC: UpdateUser,
    private readonly deleteUserUC: DeleteUser,
    private readonly getUserByIdUC: GetUserById,
    private readonly getAllUsersUC: GetAllUsers,
  
  ) { }

  createUser(user: CreateUserDto) {
    return this.createUserUC.execute(user)
  }

  getAllUsers() {
    return this.getAllUsersUC.execute()
  }

  getUserById(id: number) {
    return this.getUserByIdUC.execute(id)
  }

  updateUser(id: number, user: UpdateUserDto) {
    return this.updateUserUC.execute(id, user)

  }

  deleteUser(id: number) {
    return this.deleteUserUC.execute(id)
  }


  

}
