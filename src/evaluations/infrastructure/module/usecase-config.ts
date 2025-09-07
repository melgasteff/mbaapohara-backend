import { Provider } from "@nestjs/common";
import { CountEvaluationDetailsUseCase } from "src/evaluations/application/use-case/evaluation-detail/count.use-case";
import { CreateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/create.use-case";
import { DeleteEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/delete.use-case";
import { GetAllEvaluationDetailsUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-all.use-case";
import { GetEvaluationDetailByIdUseCase } from "src/evaluations/application/use-case/evaluation-detail/get-by-id.use-case";
import { UpdateEvaluationDetailUseCase } from "src/evaluations/application/use-case/evaluation-detail/update.use-case";
import { CountEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/count.use-case";
import { CreateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/create.use-case";
import { DeleteEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/delete.use-case";
import { GetAllEvaluationsUseCase } from "src/evaluations/application/use-case/evaluation/get-all.use-case";
import { GetEvaluationByIdUseCase } from "src/evaluations/application/use-case/evaluation/get-by-id.use-case";
import { UpdateEvaluationUseCase } from "src/evaluations/application/use-case/evaluation/update.use-case";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { EvaluationDetailRepository } from "src/evaluations/domain/repository/evaluation-detail.repository";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { ItemRepository } from "src/evaluations/domain/repository/item.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";

export default <Provider[]>[
    {
        provide: CountEvaluationsUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new CountEvaluationsUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: CreateEvaluationUseCase,
        useFactory: (
            evaluationRepo: EvaluationRepository,
            jobRepo: JobRepository,
            userRepo: UserRepository,
            companyRepo: CompanyRepository,
            officeRepo: OfficeRepository,
        ) => new CreateEvaluationUseCase(
            evaluationRepo, jobRepo, userRepo, companyRepo, officeRepo),
        inject: [
            EvaluationRepository,
            JobRepository,
            UserRepository,
            CompanyRepository,
            OfficeRepository,
        ]
    },
    {
        provide: GetEvaluationByIdUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new GetEvaluationByIdUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: DeleteEvaluationUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new DeleteEvaluationUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },
    {
        provide: UpdateEvaluationUseCase,
        useFactory: (
            evaluationRepo: EvaluationRepository,
            jobRepo: JobRepository,
            userRepo: UserRepository,
            companyRepo: CompanyRepository,
            officeRepo: OfficeRepository,

        ) => new UpdateEvaluationUseCase(evaluationRepo, jobRepo, userRepo, companyRepo, officeRepo),
        inject: [
            EvaluationRepository,
            JobRepository,
            UserRepository,
            CompanyRepository,
            OfficeRepository,
        ]
    },
    {
        provide: GetAllEvaluationsUseCase,
        useFactory: (evaluationRepo: EvaluationRepository) => new GetAllEvaluationsUseCase(evaluationRepo),
        inject: [EvaluationRepository]
    },

    //Evaluation Detail
    {
        provide: CreateEvaluationDetailUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository,
            evaluationRepo: EvaluationRepository,
            itemRepo: ItemRepository,
        ) => new CreateEvaluationDetailUseCase(
            evaluationDetailRepo, itemRepo, evaluationRepo),
        inject: [
            EvaluationDetailRepository,
            EvaluationRepository,
            ItemRepository
        ]
    },
    {
        provide: UpdateEvaluationDetailUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository,
            evaluationRepo: EvaluationRepository,
            itemRepo: ItemRepository,
        ) => new UpdateEvaluationDetailUseCase(
            evaluationDetailRepo, evaluationRepo, itemRepo),
        inject: [
            EvaluationDetailRepository,
            EvaluationRepository,
            ItemRepository,
        ]
    },
    {
        provide: DeleteEvaluationDetailUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository
        ) => new DeleteEvaluationDetailUseCase(
            evaluationDetailRepo),
        inject: [
            EvaluationDetailRepository,
        ]
    },
    {
        provide: GetEvaluationDetailByIdUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository
        ) => new GetEvaluationDetailByIdUseCase(
            evaluationDetailRepo),
        inject: [
            EvaluationDetailRepository,
        ]
    },
    {
        provide: GetAllEvaluationDetailsUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository

        ) => new GetAllEvaluationDetailsUseCase(
            evaluationDetailRepo),
        inject: [
            EvaluationDetailRepository,
        ]
    },
    {
        provide: CountEvaluationDetailsUseCase,
        useFactory: (
            evaluationDetailRepo: EvaluationDetailRepository

        ) => new CountEvaluationDetailsUseCase(
            evaluationDetailRepo),
        inject: [
            EvaluationDetailRepository,
        ]
    },
]