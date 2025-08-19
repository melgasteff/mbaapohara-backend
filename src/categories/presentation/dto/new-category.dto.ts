import { IsNotEmpty, IsString } from "class-validator";

export class NewCategoryDTO {
    @IsNotEmpty()
    @IsString()
    description: string
}