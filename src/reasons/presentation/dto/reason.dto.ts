import { IsNotEmpty } from "class-validator"

export class ReasonDTO {
    @IsNotEmpty()
    id: number
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    rating: number
}