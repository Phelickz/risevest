import { CreatePostDto } from '@/dtos/post.dto';
import { Post } from '@/interfaces/post.interface';
import { User } from '@/interfaces/users.interface';
import PostService from '@/services/post.service';
import { NextFunction, Request, Response } from 'express';

class PostController {
  public postService = new PostService();

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user: User = res.locals.user;
      const body: CreatePostDto = req.body;
      // body.userId = user.id;
      const userId = req.params.id;
      body.userId = userId;

      const p: Post = await this.postService.createPost(body);
      res.status(201).json(p);
    } catch (error) {
      next(error);
    }
  };

  public findUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      const p: Post[] = await this.postService.findUserPost(userId);
      res.status(201).json(p);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
