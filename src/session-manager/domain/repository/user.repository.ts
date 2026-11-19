import { User } from "../model/user.entity";

export abstract class UserRepository {
    abstract findByEmail(email: string): Promise<User | null>;
}