import { Evaluation } from "src/evaluations/domain/model/evaluation.entity";
import { UpdateEvaluationRequest } from "../../request/update-evaluation.request";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { EvaluationNotFoundException } from "../../exception/evaluation/evaluation-not-found.exception";
import { EvaluationAlreadyExistsException } from "../../exception/evaluation/evaluation-already-exists.exception";

export class UpdateEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository,
        private readonly jobRepo: JobRepository,
        private readonly userRepo: UserRepository,
        private readonly companyRepo: CompanyRepository,
        private readonly officeRepo: OfficeRepository,
    ) { }

    async execute(request: UpdateEvaluationRequest): Promise<Evaluation> {
        const allEvaluations = await this.evaluationRepo.getAll();
        const job = await this.jobRepo.getById(request.idjob);
        const user = await this.userRepo.getById(request.iduser);
        const company = await this.companyRepo.getById(request.idcompany);
        const office = await this.officeRepo.getById(request.idoffice);
        const evaluationFound = allEvaluations.find((evaluation) => evaluation.getId() == request.id)
        // const repeatedEvaluation = allEvaluations.
        //     find((evaluation) =>
        //         evaluation.getId() !== request.id
        //     && evaluation.getJob().getId() === job.getId()
        //     && evaluation.getOffice().getId() === office.getId()
        //     && evaluation.getUser().getId() === user.getId()
        //     && evaluation.getCompany().getId() === company.getId()
        //     );
        if (!evaluationFound) { throw new EvaluationNotFoundException(request.id); }
        //if (repeatedEvaluation) { throw new EvaluationAlreadyExistsException() }

        const updatedEvaluation = new Evaluation(
            request.id,
            user,
            job,
            office,
            company,
            new Date(request.desde),
            new Date(request.hasta),
        )

        return this.evaluationRepo.update(request.id, updatedEvaluation)
    
    }
}