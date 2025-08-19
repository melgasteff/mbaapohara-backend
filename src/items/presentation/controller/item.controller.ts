import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountItemsUseCase } from "src/items/application/use-case/count.use-case";
import { CreateItemUseCase } from "src/items/application/use-case/create.use-case";
import { DeleteItemUseCase } from "src/items/application/use-case/delete.use-case";
import { GetItemByIdUseCase } from "src/items/application/use-case/get-by-id.use-case";
import { GetAllItemsUseCase } from "src/items/application/use-case/getAll.use-case";
import { UpdateItemUseCase } from "src/items/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/items/infrastructure/exception-filter/exceptionFilter";
import { NewItemDTO } from "../dto/new-item.dto";
import { ItemDTO } from "../dto/item.dto";
import { ItemDTOMapper } from "../mapper/item-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";

@UseFilters(GlobalExceptionFilter)
@Controller('items')
export class ItemController {
    constructor(
        private readonly createItemUC: CreateItemUseCase,
        private readonly updateItemUC: UpdateItemUseCase,
        private readonly deleteItemUC: DeleteItemUseCase,
        private readonly getItemByIdUC: GetItemByIdUseCase,
        private readonly getAllItemsUC: GetAllItemsUseCase,
        private readonly countItemsUC : CountItemsUseCase
    ) { }

    @Post()
    async createItem(@Body() itemDto: NewItemDTO): Promise<ItemDTO>{
        return ItemDTOMapper.toDTO(await this.createItemUC.execute(itemDto.descripcion, itemDto.idcategory));
    }
    @Get()
    async getAllItems (): Promise<ResponseModel<ItemDTO>> {
        const itemDto = (await this.getAllItemsUC.execute()).map(item => ItemDTOMapper.toDTO(item));
        return {
            count: await this.countItemsUC.execute(),
            data: itemDto
        }
    }

    @Get(':id')
    async getItemById(@Param('id', ParseIntPipe) id: number): Promise<ItemDTO> {
        return ItemDTOMapper.toDTO(await this.getItemByIdUC.execute(id));
    }

    @Put(':id')
    async updateItem(@Param('id', ParseIntPipe) id: number, @Body() item: ItemDTO) : Promise<ItemDTO> {
        const itemToUpdate = ItemDTOMapper.toDomain(item);
        const updatedItem = await this.updateItemUC.execute(id, itemToUpdate);
        return ItemDTOMapper.toDTO(updatedItem);
    }

    @Delete(':id')
    deleteItem(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteItemUC.execute(id);
    }
}