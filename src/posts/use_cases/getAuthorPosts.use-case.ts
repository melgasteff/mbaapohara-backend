import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetAuthorPosts {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
    ) { }

    async execute(id: number) {
        const postFound = await this.postRepository.find({ where: { autor: { id } }, relations: ['autor'] })
        if (postFound.length === 0) throw new HttpException("No se han enontrado posts de este autor", HttpStatus.NOT_FOUND)
        return postFound
    }
}