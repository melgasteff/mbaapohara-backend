import { Category } from "src/categories/domain/model/category.entity";
import { CategoryDTO } from "../dto/category.dto";

export class CategoryDTOMapper {
    static toDTO(category : Category) : CategoryDTO{
            category.getDescription()
        
        return {
            id: category.getId(),
            description: category.getDescription()
        }
    }

    static toDomain(categoryDto : CategoryDTO): Category{
        return new Category(categoryDto.id, categoryDto.description)
    }
}