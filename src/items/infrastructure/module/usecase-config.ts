import { Provider } from "@nestjs/common";
import { CountItemsUseCase } from "src/items/application/use-case/count.use-case";
import { CreateItemUseCase } from "src/items/application/use-case/create.use-case";
import { DeleteItemUseCase } from "src/items/application/use-case/delete.use-case";
import { GetItemByIdUseCase } from "src/items/application/use-case/get-by-id.use-case";
import { GetAllItemsUseCase } from "src/items/application/use-case/getAll.use-case";
import { UpdateItemUseCase } from "src/items/application/use-case/update.use-case";
import { ItemRepository } from "src/items/domain/repository/item.repository";

export default <Provider[]>[
    
    {
        provide: CountItemsUseCase,
        useFactory: (itemRepository: ItemRepository) => new CountItemsUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    {
        provide: CreateItemUseCase,
        useFactory: (itemRepository: ItemRepository) => new CreateItemUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    {
        provide: GetItemByIdUseCase,
        useFactory: (itemRepository: ItemRepository) => new GetItemByIdUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    {
        provide: DeleteItemUseCase,
        useFactory: (itemRepository: ItemRepository) => new DeleteItemUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    {
        provide: UpdateItemUseCase,
        useFactory: (itemRepository: ItemRepository) => new UpdateItemUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    {
        provide: GetAllItemsUseCase,
        useFactory: (itemRepository: ItemRepository) => new GetAllItemsUseCase(itemRepository),
        inject: [ ItemRepository ]
    },
    
]