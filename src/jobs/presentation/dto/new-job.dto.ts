import { IsNotEmpty } from "class-validator";

export class NewJobDTO{
    @IsNotEmpty()
    descripcion: string

}