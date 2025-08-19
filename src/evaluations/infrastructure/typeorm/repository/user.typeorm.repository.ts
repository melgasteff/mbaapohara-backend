import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserTypeORMModel } from "../model/user.typeorm.model"
import { UserRepository } from "src/evaluations/domain/repository/user.repository"
import { Repository } from "typeorm"
import { User } from "src/evaluations/domain/model/user.entity"
import { UserMapper } from "../../mapper/user.mapper"


@Injectable()
export class UserTypeORMRepository implements UserRepository{
    constructor(
        @InjectRepository(UserTypeORMModel)
        private readonly userRepo : Repository<UserTypeORMModel>
    ){}


    async getAll(): Promise<User[]> {
        return (await this.userRepo.find()).map(userTypeOrm => UserMapper.toDomain(userTypeOrm))
    }

    async getById(id: number): Promise<User> {
        const userTypeOrm = await this.userRepo.findOneBy({id})
        return userTypeOrm ? UserMapper.toDomain(userTypeOrm) : null
    }

    count(): Promise<number> {
        return this.userRepo.count()
    }

}