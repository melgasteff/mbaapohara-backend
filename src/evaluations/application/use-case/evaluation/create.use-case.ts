import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationAlreadyExistsException } from "../../exception/evaluation/evaluation-already-exists.exception";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";
import { CreateEvaluationRequest } from "../../request/create-evaluation.request";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository";

export class CreateEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository,
        private readonly jobRepo: JobRepository,
        private readonly userRepo: UserRepository,
        private readonly companyRepo: CompanyRepository,
        private readonly officeRepo: OfficeRepository,
        private readonly contratoRepo: ContractRepository,
    ) { }
    async execute(request: CreateEvaluationRequest): Promise<Evaluation> {
        try {
            const allEvaluations = await this.evaluationRepo.getAll();

            const job = await this.jobRepo.getById(request.idjob);
            const user = await this.userRepo.getById(request.iduser);
            const company = await this.companyRepo.getById(request.idcompany);
            const office = await this.officeRepo.getById(request.idoffice);
            let contrato = null;
            if (request.idcontrato) {
                contrato = await this.contratoRepo.getById(request.idcontrato);
            }
            const evaluationFound = allEvaluations.
                find((evaluation) =>
                    evaluation.job.getId() === job.getId()
                    && evaluation.office.getId() === office.getId()
                    && evaluation.user.getId() === user.getId()
                    && evaluation.company.getId() === company.getId()
                );
            if (evaluationFound) throw new EvaluationAlreadyExistsException()
            const newEvaluation = new NewEvaluation(
                job,
                user,
                company,
                office,
                new Date(request.desde),
                new Date(request.hasta),
                contrato,
            )

            console.log("en el caso de uso crear", newEvaluation)
            return await this.evaluationRepo.create(newEvaluation)
        } catch (error) {
            console.error("error al crear la evaluacion", error)
            throw error
        }
    }
}