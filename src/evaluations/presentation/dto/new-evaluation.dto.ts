import { IsNotEmpty, IsOptional } from "class-validator";

export class NewEvaluationDTO {

  @IsNotEmpty()
  idjob: number;

  @IsNotEmpty()
  iduser: number;

  @IsNotEmpty()
  idcompany: number;

  @IsNotEmpty()
  idoffice: number;

  @IsOptional()
  idcontrato?: number |null;

  @IsNotEmpty()
  desde: string

  @IsNotEmpty()
  hasta: string
}