import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { Repository } from "typeorm";

export class GetAllPosts {
    constructor(
        @InjectRepository(Post) private postRepository : Repository<Post>
    ){}

    execute (){
        this.postRepository.find()
    }
}