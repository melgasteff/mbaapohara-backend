import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePost } from './use_cases/create.use-case';
import { UpdatePost } from './use_cases/update.use-case';
import { DeletePost } from './use_cases/delete.use-case';
import { GetAllPosts } from './use_cases/getAllPosts.use-case';
import { GetPostById } from './use_cases/getPostById.use-case';
import { GetAuthorPosts } from './use_cases/getAuthorPosts.use-case';

@Injectable()
export class PostsService {
  constructor(
    private readonly createPostUC : CreatePost,
    private readonly updatePostUC : UpdatePost,
    private readonly deletePostUC : DeletePost,
    private readonly getAllPostsUC : GetAllPosts,
    private readonly getPostByIdUC : GetPostById,
    private readonly getAuthorPostsUC : GetAuthorPosts,
  ){}
  createPost(post: CreatePostDto) {
    return this.createPostUC.execute(post)
  }

  getAllPosts() {
    return this.getAllPostsUC.execute()
  }

  getPostById(id: number) {
    return this.getPostByIdUC.execute(id)
  }

  getAuthorPosts(id: number){
    return this.getAuthorPostsUC.execute(id)
  }

  updatePost(id: number, post: UpdatePostDto) {
    return this.updatePostUC.execute(id, post)
  }

  deletePost(id: number) {
    return this.deletePostUC.execute(id)
  }


}
