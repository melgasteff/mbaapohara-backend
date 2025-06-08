import { User } from "src/session-manager/domain/model/user.entity";
import { UserRepository } from "src/session-manager/domain/repository/user.respository";
import { UnauthorizedException } from "../exception/unauthorized.exception";
import { UserNotFoundException } from "../exception/user-not-found.exception";
import * as bcrypt from 'bcrypt';
import { PasswordNotFoundException } from "../exception/password-not-found.exception";


export class LoginUseCase {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(email: string, plainPassword: string): Promise<User> {
       try {
        console.log(email, plainPassword)
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new UserNotFoundException(email);
        if (!plainPassword) throw new PasswordNotFoundException(email)
            console.log(user.getContrasenha())

        const passwordMatches = await bcrypt.compare(plainPassword, user.getContrasenha());
        console.log(passwordMatches)
        if (!passwordMatches) throw new UnauthorizedException();

        return user;
       } catch (error) {
        console.log("Error al intentar loggearse",error)
        throw error
       }
        
    }
}