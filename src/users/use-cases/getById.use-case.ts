import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetUserById {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async execute(id: number) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ['ciudad'] })

        if (!userFound) return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        return userFound
    }
}