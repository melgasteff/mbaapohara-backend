import { IsNotEmpty, isNotEmpty, IsString } from "class-validator"
import { Office } from "src/offices/entities/office.entity"

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    nombre :string

    @IsString()
    @IsNotEmpty()
    rubro :string

//     @IsString()
//     offices : Office[]
}
