
import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { UpdateEvaluationRequest } from "../../request/update-evaluation.request";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository";
import { EvaluationAlreadyExistsException } from "../../exception/evaluation/evaluation-already-exists.exception";

export class UpdateEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository,
        private readonly jobRepo: JobRepository,
        private readonly userRepo: UserRepository,
        private readonly companyRepo: CompanyRepository,
        private readonly officeRepo: OfficeRepository,
        private readonly contratoRepo: ContractRepository,
    ) { }

    async execute(request: UpdateEvaluationRequest): Promise<Evaluation> {
        try {
            const allEvaluations = await this.evaluationRepo.getAll();
            console.log("request", request)
            const job = await this.jobRepo.getById(request.idjob);
            const user = await this.userRepo.getById(request.iduser);
            const company = await this.companyRepo.getById(request.idcompany);
            const office = await this.officeRepo.getById(request.idoffice);
            let contrato = null;
            if (request.idcontrato) {
                contrato = await this.contratoRepo.getById(request.idcontrato);
            }
            console.log("job", job.getId())
            console.log("user", user.getId())
            console.log("company", company.getId())
            console.log("office", office.getId())
            const evaluationFound = allEvaluations.find((evaluation) => evaluation.getId() == request.id)
            const repeatedEvaluation = allEvaluations.
                find((evaluation) =>
                    evaluation.getId() !== request.id
                    && evaluation.job.getId() === job.getId()
                    && evaluation.office.getId() === office.getId()
                    && evaluation.user.getId() === user.getId()
                    && evaluation.company.getId() === company.getId()
                );
            console.log("update", evaluationFound)
            if (!evaluationFound) { throw new EvaluationNotFoundException(request.id); }
            if (repeatedEvaluation) { throw new EvaluationAlreadyExistsException() }

            const updatedEvaluation = new Evaluation(
                request.id,
                job,
                user,
                company,
                office,
                new Date(request.desde),
                new Date(request.hasta),
                contrato,
            )

            return this.evaluationRepo.update(request.id, updatedEvaluation)
        } catch (error) {
            console.error("Error al actualizar la evaluacion:", error);
            throw error
        }
    }
}