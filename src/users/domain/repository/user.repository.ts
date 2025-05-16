import { NewUser } from "../model/new-user.entity";
import { User } from "../model/user.entity";

export abstract class UserRepository {
    abstract create(newUser:NewUser) : Promise<User>
    abstract getAll(): Promise<User[]>
    abstract getById(id:number): Promise<User>
    abstract update(id: number, user: User): Promise<User>
    abstract delete(id: number): Promise<void>
    abstract count (): Promise<number>
}