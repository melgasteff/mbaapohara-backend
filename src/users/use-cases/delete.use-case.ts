import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteUser {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }
    async execute(id: number) {
        const result = await this.userRepository.delete({ id })
        if (result.affected === 0) return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

        return result;
    }
}