import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetPostById {
    constructor(
        @InjectRepository(Post) private postRepository : Repository<Post>
    ){}

    execute (id: number) {
        const postFound =this.postRepository.find({where : {id}})
        if(!postFound) throw new HttpException("No se ha encontrado el post", HttpStatus.NOT_FOUND)
    }
}