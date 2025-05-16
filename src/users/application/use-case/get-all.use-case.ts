import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";

export class GetAllUsersUseCase {
    
    constructor(
        private userRepo: UserRepository
    ){}

    public async execute(): Promise<User[]>{
        return this.userRepo.getAll();
    }
}