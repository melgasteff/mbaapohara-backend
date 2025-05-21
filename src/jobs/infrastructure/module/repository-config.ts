import { Provider } from "@nestjs/common";
import { JobRepository } from "src/jobs/domain/repository/job.repository";
import { JobTypeORMRepository } from "../typeorm/repository/job.typeorm.repository";

export default <Provider[]>[
    {
        provide: JobRepository,
        useClass: JobTypeORMRepository
    },
]