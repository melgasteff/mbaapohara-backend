import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { ApiTags } from "@nestjs/swagger";
import { Body, Query, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { mapPage, Page } from "src/shared/domain/page";
import { PaginationQueryDTO } from "src/shared/infrastructure/rest/pagination-query.dto";
import { CreateItemUseCase } from "src/items/application/use-case/create.use-case";
import { DeleteItemUseCase } from "src/items/application/use-case/delete.use-case";
import { GetItemByIdUseCase } from "src/items/application/use-case/get-by-id.use-case";
import { GetAllItemsUseCase } from "src/items/application/use-case/get-all.use-case";
import { UpdateItemUseCase } from "src/items/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/items/infrastructure/exception-filter/exception-filter";
import { NewItemDTO } from "../dto/new-item.dto";
import { ItemDTO } from "../dto/item.dto";
import { ItemDTOMapper } from "../mapper/item-dto.mapper";

@UseFilters(GlobalExceptionFilter)
@ApiTags('Ítems')
@Controller('items')
export class ItemController {
    constructor(
        private readonly createItemUC: CreateItemUseCase,
        private readonly updateItemUC: UpdateItemUseCase,
        private readonly deleteItemUC: DeleteItemUseCase,
        private readonly getItemByIdUC: GetItemByIdUseCase,
        private readonly getAllItemsUC: GetAllItemsUseCase
    ) { }

    @Roles(UserRole.Admin)

    @Post()
    async createItem(@Body() itemDto: NewItemDTO): Promise<ItemDTO>{
        return ItemDTOMapper.toDTO(await this.createItemUC.execute(itemDto.descripcion, itemDto.idcategory));
    }
    @Public()

    @Get()
    async getAllItems(@Query() query: PaginationQueryDTO): Promise<Page<ItemDTO>> {
        return mapPage(await this.getAllItemsUC.execute(query), item => ItemDTOMapper.toDTO(item));
    }

    @Public()

    @Get(':id')
    async getItemById(@Param('id', ParseIntPipe) id: number): Promise<ItemDTO> {
        return ItemDTOMapper.toDTO(await this.getItemByIdUC.execute(id));
    }

    @Roles(UserRole.Admin)

    @Put(':id')
    async updateItem(@Param('id', ParseIntPipe) id: number, @Body() item: ItemDTO) : Promise<ItemDTO> {
        const itemToUpdate = ItemDTOMapper.toDomain(item);
        const updatedItem = await this.updateItemUC.execute(id, itemToUpdate);
        return ItemDTOMapper.toDTO(updatedItem);
    }

    @Roles(UserRole.Admin)

    @Delete(':id')
    deleteItem(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteItemUC.execute(id);
    }
}