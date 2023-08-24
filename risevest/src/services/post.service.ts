import DB from '@/databases';
import { CreatePostDto } from '@/dtos/post.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Post } from '@/interfaces/post.interface';
import { User } from '@/interfaces/users.interface';
import { CommentModel } from '@/models/comment.model';
import { isEmpty } from 'class-validator';

class PostService {
  public posts = DB.Posts;
  public users = DB.Users;

  public async createPost(b: CreatePostDto): Promise<Post> {
    if (isEmpty(b)) throw new HttpException(400, 'data is empty');

    const findUser: User = await this.users.findByPk(b.userId);
    if (!findUser) throw new HttpException(400, 'user not found. did you pass in a wrong id?');

    const p: Post = await this.posts.create(b);
    await this.users.increment('postCount', { where: { id: b.userId } });
    return p;
  }

  public async findUserPost(userId: string): Promise<Post[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(400, 'user not found. did you pass in a wrong id?');

    const p: Post[] = await this.posts.findAll({ where: { userId }, include: [{ model: CommentModel, as: 'comments' }] });
    return p;
  }
}

export default PostService;
