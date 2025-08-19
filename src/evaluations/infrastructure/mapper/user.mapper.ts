import { User } from "src/evaluations/domain/model/user.entity";
import { UserTypeORMModel } from "../typeorm/model/user.typeorm.model";


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

    static toTypeORMModel(newUser: User): UserTypeORMModel{
        const userTypeORM = new UserTypeORMModel();
        userTypeORM.id = newUser.getId();
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