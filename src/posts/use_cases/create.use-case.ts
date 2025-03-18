import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CreatePost {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async execute(post: CreatePostDto) {
        const autor = Number (post.autor)
        const autorFound = await this.userRepository.findOne({ where: { id: autor } })
        if(!autorFound) throw new HttpException("El autor no existe", HttpStatus.NOT_FOUND)
        
        try {
            const newPost = this.postRepository.create(post)
            return this.postRepository.save(newPost)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}