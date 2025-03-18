import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  createPost(@Body() Newpost: CreatePostDto) {
    return this.postsService.createPost(Newpost);
  }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts()
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Get('/author/:id')
  getAuthorPosts(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getAuthorPosts(id);
  }

  @Patch(':id')
  updatePost(@Param('id', ParseIntPipe) id: number, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(id, post);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id)
  }


}
