import { Evaluation } from "src/evaluations/domain/model/evauation.entity";
import { CompanyRepository } from "src/evaluations/domain/repository/company.repository";
import { EvaluationRepository } from "src/evaluations/domain/repository/evaluation.repository";
import { JobRepository } from "src/evaluations/domain/repository/job.repository";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { UserRepository } from "src/evaluations/domain/repository/user.repository";
import { CreateEvaluationRequest } from "../request/create-evaluation.request";
import { EvaluationAlreadyExistsException } from "../exception/evaluation-already-exists.exception";
import { NewEvaluation } from "src/evaluations/domain/model/new-evaluation.entity";


export class CreateEvaluationUseCase {
  constructor(
    private readonly evaluationRepo: EvaluationRepository,
    private readonly jobRepo: JobRepository,
    private readonly userRepo: UserRepository,
    private readonly companyRepo: CompanyRepository,
    private readonly officeRepo: OfficeRepository,
  ) {}

  async execute(request: CreateEvaluationRequest): Promise<Evaluation> {
    const allEvaluations = await this.evaluationRepo.getAll();

    const job = await this.jobRepo.getById(request.idjob);
    const user = await this.userRepo.getById(request.iduser);
    const company = await this.companyRepo.getById(request.idcompany);
    const office = await this.officeRepo.getById(request.idoffice);
    const desdeReq = new Date(request.desde);
    const hastaReq = new Date(request.hasta);

    const evaluationFound = allEvaluations.find(
      (evaluation) =>
        evaluation.getJob().getId() === job.getId() &&
        evaluation.getOffice().getId() === office.getId() &&
        evaluation.getUser().getId() === user.getId() &&
        evaluation.getCompany().getId() === company.getId() &&
        evaluation.getDesde().getTime() === desdeReq.getTime() &&
        evaluation.getHasta().getTime() === hastaReq.getTime()
    );

    if (evaluationFound) {
      throw new EvaluationAlreadyExistsException();
    }

    const newEvaluation = new NewEvaluation(
      user,
      job,
      office,
      company,
      desdeReq,
      hastaReq,
    );

    return await this.evaluationRepo.create(newEvaluation);
  }
}