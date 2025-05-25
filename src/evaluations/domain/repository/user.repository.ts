import { User } from "../model/user.entity";

export abstract class UserRepository {
    abstract getAll(): Promise<User[]>
    abstract getById(id:number): Promise<User>
    abstract count (): Promise<number>
}