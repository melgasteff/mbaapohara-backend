import { Provider } from "@nestjs/common";
import { CountCategoriesUseCase } from "src/categories/application/use-case/count.use-case";
import { CreateCategoryUseCase } from "src/categories/application/use-case/create.use-case";
import { DeleteCategoryUseCase } from "src/categories/application/use-case/delete.use-case";
import { GetCategoryByIdUseCase } from "src/categories/application/use-case/get-category-by-id.use-case";
import { GetAllCategoriesUseCase } from "src/categories/application/use-case/getAll.use-case";
import { UpdateCategoryUseCase } from "src/categories/application/use-case/update.use-case";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";

export default <Provider[]>[
    
    {
        provide: CountCategoriesUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new CountCategoriesUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    {
        provide: CreateCategoryUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new CreateCategoryUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    {
        provide: GetCategoryByIdUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new GetCategoryByIdUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    {
        provide: DeleteCategoryUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new DeleteCategoryUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    {
        provide: UpdateCategoryUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new UpdateCategoryUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    {
        provide: GetAllCategoriesUseCase,
        useFactory: (categoryRepo: CategoryRepository) => new GetAllCategoriesUseCase(categoryRepo),
        inject: [ CategoryRepository ]
    },
    
]