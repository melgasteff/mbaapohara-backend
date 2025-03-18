import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeletePost{
    constructor(
    @InjectRepository(Post) private postRepository : Repository<Post>
    ){}

    async execute(id :number){
        const result = await this.postRepository.delete({id})
        if(result.affected === 0) throw new HttpException("No se ha encontrado el post", HttpStatus.NOT_FOUND)

        return result
    }
}