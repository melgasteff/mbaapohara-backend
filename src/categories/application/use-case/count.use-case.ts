import { CategoryRepository } from "src/categories/domain/repository/category.repository";

export class CountCategoriesUseCase {
    constructor(
        private categoryRepo: CategoryRepository
    ) { }

    async execute(): Promise<number> {
        try {
            return this.categoryRepo.count()
        } catch (error) {
            console.error("No se ha podido contar las categorias", error)
            throw error
        }
    }
}