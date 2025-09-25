import { EvaluationDetail } from "./evaluation-detail.entity"
import { Reason } from "./reason.entity"

export class ReasonDetail {
    private reason: Reason
    private evaluationDetail: EvaluationDetail

    constructor(
        reason: Reason,
        evaluationDetail: EvaluationDetail,
    ) {
        if (reason == null) throw new Error("El motivo es requerido")
        if (evaluationDetail == null) throw new Error("El detalle de evaluacion es requerida")

        this.reason = reason
        this.evaluationDetail = evaluationDetail
    }

    getReason(): Reason { return this.reason }
    getEvaluationDetail(): EvaluationDetail { return this.evaluationDetail }

}