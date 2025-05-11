import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewCityDTO {
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  idpais: number
}