import { IsNotEmpty } from "class-validator";

export class NewItemDTO {
    @IsNotEmpty()
    descripcion: string;
    @IsNotEmpty()
    idcategory: number
}