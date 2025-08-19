import { Item } from "src/items/domain/model/item.entity"
import { ItemDTO } from "../dto/item.dto"

export class ItemDTOMapper{
    static toDTO(item: Item): ItemDTO{
        return { 
            id: item.getId(),
            descripcion: item.getDescripcion(),
            idcategory: item.getCategory()
        }
    }

    static toDomain(itemDto: ItemDTO): Item{
        console.log(itemDto.id, itemDto.descripcion, itemDto.idcategory, "mapper")
        return new Item(itemDto.id, itemDto.descripcion, itemDto.idcategory)
    }
}
