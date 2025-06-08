import { Provider } from "@nestjs/common";
import { UserRepository } from "src/session-manager/domain/repository/user.respository";
import { UserTypeORMRepository } from "../typeorm/repository/user.typeorm.repository";

export default <Provider[]>[
    {
        provide: UserRepository,
        useClass: UserTypeORMRepository
    },
]