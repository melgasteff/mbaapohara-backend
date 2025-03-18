import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CreatePost } from './use_cases/create.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdatePost } from './use_cases/update.use-case';
import { DeletePost } from './use_cases/delete.use-case';
import { GetAllPosts } from './use_cases/getAllPosts.use-case';
import { GetPostById } from './use_cases/getPostById.use-case';
import { GetAuthorPosts } from './use_cases/getAuthorPosts.use-case';



@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostsController],
  providers: [
    PostsService,
    CreatePost,
    UpdatePost,
    DeletePost,
    GetAllPosts,
    GetPostById,
    GetAuthorPosts,
  ],
  exports: [PostsService]
})
export class PostsModule {}
