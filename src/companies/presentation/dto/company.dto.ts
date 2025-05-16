import { IsNotEmpty } from "class-validator";

export class CompanyDTO {
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    rubro: string 
  }