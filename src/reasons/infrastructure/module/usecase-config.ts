import { Provider } from "@nestjs/common";
import { CountReasonsUseCase } from "src/reasons/application/use-case/count.use-case";
import { CreateReasonUseCase } from "src/reasons/application/use-case/create.use-case";
import { DeleteReasonUseCase } from "src/reasons/application/use-case/delete.use-case";
import { GetAllReasonsUseCase } from "src/reasons/application/use-case/get-all.use-case";
import { GetReasonByIdUseCase } from "src/reasons/application/use-case/get-by-id.use-case";
import { UpdateReasonUseCase } from "src/reasons/application/use-case/update.use-case";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";

export default <Provider[]>[
    
    {
        provide: CountReasonsUseCase,
        useFactory: (reasonRepo: ReasonRepository) => new CountReasonsUseCase(reasonRepo),
        inject: [ ReasonRepository ]
    },
    {
        provide: CreateReasonUseCase,
        useFactory: (resonRepo: ReasonRepository) => new CreateReasonUseCase(resonRepo),
        inject: [ ReasonRepository ]
    },
    {
        provide: GetReasonByIdUseCase,
        useFactory: (reasonRepo: ReasonRepository) => new GetReasonByIdUseCase(reasonRepo),
        inject: [ ReasonRepository ]
    },
    {
        provide: DeleteReasonUseCase,
        useFactory: (reasonRepo: ReasonRepository) => new DeleteReasonUseCase(reasonRepo),
        inject: [ ReasonRepository ]
    },
    {
        provide: UpdateReasonUseCase,
        useFactory: (reasonRepo: ReasonRepository) => new UpdateReasonUseCase(reasonRepo),
        inject: [ ReasonRepository ]
    },
    {
        provide: GetAllReasonsUseCase,
        useFactory: (reasonRepo: ReasonRepository) => new GetAllReasonsUseCase(reasonRepo),
        inject: [ ReasonRepository ]
    },
    
]