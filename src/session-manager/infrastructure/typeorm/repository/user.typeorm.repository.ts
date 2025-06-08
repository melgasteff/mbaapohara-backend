import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserRepository } from "src/session-manager/domain/repository/user.respository"
import { UserTypeORMModel } from "../model/user.typeorm.model"
import { Repository } from "typeorm"
import { User } from "src/session-manager/domain/model/user.entity"

@Injectable()
export class UserTypeORMRepository implements UserRepository{
    constructor(
        @InjectRepository(UserTypeORMModel)
        private readonly userRepo : Repository<UserTypeORMModel>
    ){}
    async findByEmail(email: string): Promise<User | null> {
        const userOrm = await this.userRepo.findOne({ where: { email } });
        if (!userOrm) return null;
        return new User( userOrm.email, userOrm.contrasenha);
    }

    

}