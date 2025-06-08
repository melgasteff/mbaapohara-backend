import { User } from "src/users/domain/model/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserAlreadyExistsException } from "../exception/user-already-exists.exception";
import { NewUser } from "src/users/domain/model/new-user.entity";
import * as bcrypt from 'bcrypt';
import { EmailAlreadyUsedException } from "../exception/email-already-used.exception";

export class CreateUserUseCase {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async execute(
        nombre: string,
        apellido: string,
        usuario: string,
        email : string, 
        contrasenha : string, 
        idciudad: number, 
        tipoUsuario : string,
        descripcion: string
    ): Promise<User> {
        try {
            const allUsers = await this.userRepo.getAll();
            const userFound = allUsers.find((repeatedUser) => repeatedUser.getUsuario().toLowerCase() === usuario.toLowerCase(),);
            const emailFound = allUsers.find((repeatedEmail) => repeatedEmail.getEmail()=== email)
            if (userFound) throw new UserAlreadyExistsException(usuario);
            if(emailFound) throw new EmailAlreadyUsedException(email)
            const hashedPassword = await bcrypt.hash(contrasenha, 10);

            const newUser = new NewUser(
                nombre,
                apellido,
                usuario,
                email,
                hashedPassword,
                idciudad,
                tipoUsuario,
                descripcion
            );
            return await this.userRepo.create(newUser);

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    }
}