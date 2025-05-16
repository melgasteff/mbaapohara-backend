import { UserRepository } from "src/users/domain/repository/user.repository";

export class CountUsersUseCase {
    constructor(
        private userRepo: UserRepository
    ){}

    public async execute(): Promise<number> {
        return this.userRepo.count();
    }
}