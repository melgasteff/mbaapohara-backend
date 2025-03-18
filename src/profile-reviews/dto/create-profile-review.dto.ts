import { IsNumber, IsString } from "class-validator"

export class CreateProfileReviewDto {
        @IsNumber()
        calidad?: number
    
        @IsNumber()
        atencion?: number
    
        @IsNumber()
        costo?: number

        @IsString()
        comentario?:string
    
}
