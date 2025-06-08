import { IsArray, IsNotEmpty } from "class-validator";

export class NewBenefitEvaluationDTO {
  @IsNotEmpty()
  @IsArray()
  beneficios: number[]; 
}