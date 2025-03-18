import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

export class GetAllUsers {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    execute() {
        return this.userRepository.find({ relations: ['ciudad'] })
    }
}