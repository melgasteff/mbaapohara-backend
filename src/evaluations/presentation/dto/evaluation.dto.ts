import { IsNotEmpty } from "class-validator";

export class EvaluationDTO {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  idjob: number;

  @IsNotEmpty()
  iduser: number;

  @IsNotEmpty()
  idcompany: number;

  @IsNotEmpty()
  idoffice: number;

  @IsNotEmpty()
  desde: string

  @IsNotEmpty()
  hasta: string
}