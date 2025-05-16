import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewUser } from "src/users/domain/model/new-user.entity";
import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { Repository } from "typeorm";
import { UserTypeORMModel } from "../model/user.typeorm.model";
import { UserMapper } from "../../mapper/user.mapper";

@Injectable()
export class UserTypeORMRepository implements UserRepository{
    constructor(
        @InjectRepository(UserTypeORMModel)
        private readonly userRepo : Repository<UserTypeORMModel>
    ){}

    async create(newUser: NewUser): Promise<User> {
        const userTypeOrm = await this.userRepo.save(UserMapper.toTypeORMModel(newUser))
        return UserMapper.toDomain(userTypeOrm)
    }

    async getAll(): Promise<User[]> {
        return (await this.userRepo.find()).map(userTypeOrm => UserMapper.toDomain(userTypeOrm))
    }

    async getById(id: number): Promise<User> {
        const userTypeOrm = await this.userRepo.findOneBy({id})
        return userTypeOrm ? UserMapper.toDomain(userTypeOrm) : null
    }

    async update(id: number, user: Partial<User>): Promise<User> {
        const userFound = await this.userRepo.findOneBy({id})
        const updatedUser = Object.assign(userFound, user)
        const savedUser = await this.userRepo.save(updatedUser)
        return UserMapper.toDomain(savedUser)
    }

    async delete(id: number): Promise<void> {
        await this.userRepo.delete(id)
    }

    count(): Promise<number> {
        return this.userRepo.count()
    }

}