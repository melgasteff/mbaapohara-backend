import { IsArray, IsNotEmpty } from "class-validator";
import { BenefitDTO } from "./benefit.dto";

export class BenefitEvaluationDTO {
  idEvaluacion: number
  @IsNotEmpty()
  @IsArray()
  beneficios: BenefitDTO[]; 
}