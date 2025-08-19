import { IsNotEmpty } from "class-validator";

export class ItemDTO {
    @IsNotEmpty()
    id: number
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    idcategory: number
}