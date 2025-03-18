import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { Repository } from "typeorm";
import { UpdatePostDto } from "../dto/update-post.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

export class UpdatePost {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async execute(id: number, post: UpdatePostDto) {
        const postFound = await this.postRepository.findOne({ where: { id }, relations: ['autor'] })
        if (!postFound) throw new HttpException("No se ha encontrado el Post", HttpStatus.NOT_FOUND)

        const autor = Number(post.autor)
        const autorFound = await this.userRepository.findOne({ where: { id: autor } })
        if (!autorFound) throw new HttpException("El autor no existe", HttpStatus.NOT_FOUND)

        try {
            const updatedPost = Object.assign(postFound, post)
            return this.postRepository.save(updatedPost)
        } catch (error) {
            throw new HttpException("Error al actualizar el post", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}