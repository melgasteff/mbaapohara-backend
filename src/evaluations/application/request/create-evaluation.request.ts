export interface CreateEvaluationRequest {
    idjob: number;
    iduser: number;
    idcompany: number;
    idoffice: number;
    desde: string;
    hasta: string;
}