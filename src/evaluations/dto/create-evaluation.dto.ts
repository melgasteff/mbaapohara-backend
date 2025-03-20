import { IsNotEmpty, IsNumber, isNumber, IsOptional } from "class-validator";

export class CreateEvaluationDto {
    @IsNumber()
    @IsNotEmpty()
    job : number

    @IsNumber()
    company : number

    @IsOptional()
    @IsNumber()
    office ?: number

    @IsNumber()
    @IsNotEmpty()
    user : number
}
