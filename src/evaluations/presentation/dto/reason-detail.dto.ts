import { IsNotEmpty } from "class-validator";

export class ReasonDetailDTO {
    @IsNotEmpty()
    idEvaluationDetail: number;
    @IsNotEmpty()
    idReason: number;
}