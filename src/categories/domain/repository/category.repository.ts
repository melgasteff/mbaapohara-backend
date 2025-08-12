import { Category } from "../model/category.entity";
import { NewCategory } from "../model/new-category.entity";

export abstract class CategoryRepository {
  abstract create(newCategory: NewCategory): Promise<Category>;
  abstract getAll(): Promise<Category[]>;
  abstract getById(id: number): Promise<Category | null>;
  abstract update(id: number, category: Partial<Category>): Promise<Category>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}
