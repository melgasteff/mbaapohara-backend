import { IsNotEmpty } from "class-validator"

export class JobDTO{
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    descripcion: string

}