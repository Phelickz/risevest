import { Router } from 'express';
import PostController from '@controllers/post.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import CommentController from '@/controllers/comment.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateCommentDto } from '@/dtos/comment.dto';

class PostRoute implements Routes {
  public path = '/posts/';
  public router = Router();
  public postController = new PostController();
  public commentController = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}:id(\\w+-\\w+-\\w+-\\w+-\\w+)/comment`,
      authMiddleware,
      validationMiddleware(CreateCommentDto, 'body'),
      this.commentController.createComment,
    );
  }
}

export default PostRoute;
