export interface CreateEvaluationRequest {
    idjob: number;
    iduser: number;
    idcompany: number;
    idoffice: number;
    idcontrato?: number;
    desde: string;
    hasta: string;
}