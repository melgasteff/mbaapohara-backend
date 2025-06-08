
import { User } from "src/session-manager/domain/model/user.entity";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";

export class UserMapper{
    static toDomain(userTypeOrm: UserTypeORMModel): User{
        return new User(
            userTypeOrm.email,
            userTypeOrm.contrasenha,
        );
    }

    static toTypeORMModel(user: User): UserTypeORMModel{
        const userTypeORM = new UserTypeORMModel();
        userTypeORM.email = user.getEmail();
        userTypeORM.contrasenha = user.getContrasenha();
        return userTypeORM;
    }
}