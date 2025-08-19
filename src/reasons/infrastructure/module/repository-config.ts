import { Provider } from "@nestjs/common";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { ReasonTypeORMRepository } from "../typeorm/repository/reason.typeorm.repository";

export default <Provider[]>[
    {
        provide: ReasonRepository,
        useClass: ReasonTypeORMRepository
    },
]