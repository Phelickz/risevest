import DB from '@/databases';
import { CreateCommentDto } from '@/dtos/comment.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Comment } from '@/interfaces/comment.interface';
import { Post } from '@/interfaces/post.interface';
import { isEmpty } from 'class-validator';

class CommentService {
  public comments = DB.Comments;
  public posts = DB.Posts;

  public async createComment(c: CreateCommentDto): Promise<Comment> {
    if (isEmpty(c)) throw new HttpException(400, 'comment is empty');
    console.log('HERERE');

    const post: Post = await this.posts.findByPk(c.postId);
    if (!post) throw new HttpException(400, 'post not found');
    c.postId = post.id;
    console.log('HEREREasdasdas');

    const co: Comment = await this.comments.create(c);
    return co;
  }
}

export default CommentService;
