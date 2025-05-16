import { UserRepository } from "src/users/domain/repository/user.repository";
import { UserTypeORMRepository } from "../typeorm/repository/user.typeorm.repository";
import { Provider } from "@nestjs/common";

export default <Provider[]>[
    {
        provide: UserRepository,
        useClass: UserTypeORMRepository
    },
]