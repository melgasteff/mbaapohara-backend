import { Provider } from "@nestjs/common";
import { LoginUseCase } from "src/session-manager/application/use-case/login.use-case";
import { UserRepository } from "src/session-manager/domain/repository/user.respository";

export default <Provider[]>[
    {
        provide: LoginUseCase,
        useFactory : (userRepo: UserRepository) => new LoginUseCase(userRepo),
        inject: [UserRepository]
    },
]