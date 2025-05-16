import { User } from "src/users/domain/model/user.entity";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";
import { NewUser } from "src/users/domain/model/new-user.entity";

export class UserMapper{
    static toDomain(userTypeOrm: UserTypeORMModel): User{
        return new User(
            userTypeOrm.id,
            userTypeOrm.nombre,
            userTypeOrm.apellido,
            userTypeOrm.usuario,
            userTypeOrm.email,
            userTypeOrm.contrasenha,
            userTypeOrm.idciudad,
            userTypeOrm.tipoUsuario,
            userTypeOrm.descripcion
        );
    }

    static toTypeORMModel(newUser: NewUser): UserTypeORMModel{
        const userTypeORM = new UserTypeORMModel();
        userTypeORM.nombre = newUser.getNombre();
        userTypeORM.apellido= newUser.getApellido();
        userTypeORM.usuario = newUser.getUsuario();
        userTypeORM.email = newUser.getEmail();
        userTypeORM.contrasenha = newUser.getContrasenha();
        userTypeORM.idciudad = newUser.getCiudad();
        userTypeORM.tipoUsuario = newUser.getTipoUsuario();
        userTypeORM.descripcion = newUser.getDescripcion()
        return userTypeORM;
    }
}