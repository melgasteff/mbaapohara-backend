import { Category } from "src/categories/domain/model/category.entity";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";

export class GetAllCategoriesUseCase {
    constructor(
        private categoryRepo: CategoryRepository
    ) { }

    async execute(): Promise<Category[]> {
        console.log("Caso de uso get all")
        try {
            return this.categoryRepo.getAll()
        } catch (error) {
            console.error('Error al obtener las categorias', error)
            throw error
        }
    }
}