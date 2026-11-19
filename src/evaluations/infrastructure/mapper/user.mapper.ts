import { User } from "src/evaluations/domain/model/user.entity";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";

export class UserMapper{
    static toDomain(userTypeOrm: UserTypeORMModel): User{
        return new User(userTypeOrm.id, userTypeOrm.email);
    }

    static toTypeORMModel(newUser: User): UserTypeORMModel{
        const userTypeORM = new UserTypeORMModel();
        userTypeORM.id = newUser.getId();
        userTypeORM.email = newUser.getEmail();
        return userTypeORM;
    }
}
