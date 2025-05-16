import { Provider } from "@nestjs/common";
import { CountUsersUseCase } from "src/users/application/use-case/count.use-case";
import { CreateUserUseCase } from "src/users/application/use-case/create.use-case";
import { DeleteUserUseCase } from "src/users/application/use-case/delete.use-case";
import { GetAllUsersUseCase } from "src/users/application/use-case/get-all.use-case";
import { GetUserByIdUseCase } from "src/users/application/use-case/get-by-id.use-case";
import { UpdateUserUseCase } from "src/users/application/use-case/update.use-case";
import { UserRepository } from "src/users/domain/repository/user.repository";

export default <Provider[]>[
    {
        provide: CountUsersUseCase,
        useFactory : (userRepo: UserRepository) => new CountUsersUseCase(userRepo),
        inject: [UserRepository]
    },
    {
        provide: CreateUserUseCase,
        useFactory : (userRepo: UserRepository) => new CreateUserUseCase(userRepo),
        inject: [UserRepository]
    },
    {
        provide: UpdateUserUseCase,
        useFactory : (userRepo: UserRepository) => new UpdateUserUseCase(userRepo),
        inject: [UserRepository]
    },
    {
        provide: DeleteUserUseCase,
        useFactory : (userRepo: UserRepository) => new DeleteUserUseCase(userRepo),
        inject: [UserRepository]
    },
    {
        provide: GetAllUsersUseCase,
        useFactory : (userRepo: UserRepository) => new GetAllUsersUseCase(userRepo),
        inject: [UserRepository]
    },
    {
        provide: GetUserByIdUseCase,
        useFactory : (userRepo: UserRepository) => new GetUserByIdUseCase(userRepo),
        inject: [UserRepository]
    },
]