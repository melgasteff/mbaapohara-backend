import { Category } from "src/categories/domain/model/category.entity";
import { NewCategory } from "src/categories/domain/model/new-category.entity";
import { CategoryTypeORMModel } from "../typeorm/model/category.typeorm.model";

export class CategoryMapper {
    static toDomain(categoryTypeOrm : CategoryTypeORMModel): Category{
        console.log("CategoryMApper to domain")
        return new Category(categoryTypeOrm.id, categoryTypeOrm.description)
    }

    static toTypeORMModel (newCategory : NewCategory): CategoryTypeORMModel {
        const categoryTypeORM = new CategoryTypeORMModel();
        categoryTypeORM.description = newCategory.getDescription()
        return categoryTypeORM;
    }
}