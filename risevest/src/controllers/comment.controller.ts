import { CreateCommentDto } from '@/dtos/comment.dto';
import { Comment } from '@/interfaces/comment.interface';
import { User } from '@/interfaces/users.interface';
import CommentService from '@/services/comment.service';
import { Request, Response, NextFunction } from 'express';

class CommentController {
  public commentService = new CommentService();

  public createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: User = res.locals.user;
      const body: CreateCommentDto = req.body;
      const postId = req.params.id;
      body.postId = postId;
      body.userId = user.id;

      const c: Comment = await this.commentService.createComment(body);
      res.status(201).json(c);
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
