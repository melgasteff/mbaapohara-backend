import { IsNotEmpty } from "class-validator";

export class NewEvaluationDTO {

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