import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class NewReasonDTO {
    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    rating: number
}