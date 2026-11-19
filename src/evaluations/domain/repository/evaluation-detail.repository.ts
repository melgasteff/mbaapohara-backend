import { Page, PageRequest } from "src/shared/domain/page";
import { EvaluationDetail } from "../model/evaluation-detail.entity";
import { NewEvaluationDetail } from "../model/new-evaluation-detail.entity";

export abstract class EvaluationDetailRepository {
    abstract create(newEvaluationDetail: NewEvaluationDetail): Promise<EvaluationDetail>
    abstract getAll(evaluationid:number): Promise<EvaluationDetail[]>
    abstract getById(id: number): Promise<EvaluationDetail | null>;
    abstract update(id: number, evaluationDetail: Partial<EvaluationDetail>): Promise<EvaluationDetail>;
    abstract delete(id: number): Promise<void>;
    abstract getPage(evaluationid: number, request: PageRequest): Promise<Page<EvaluationDetail>>;
}