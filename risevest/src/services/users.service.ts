import { hash } from 'bcrypt';
import DB from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { Op } from 'sequelize';
import { UserModel } from '@/models/users.model';
import { Comment } from '@/interfaces/comment.interface';
import { CommentModel } from '@/models/comment.model';

class UserService {
  public users = DB.Users;
  public comments = DB.Comments;

  public async topUsers(): Promise<object> {
    const topUsers = await this.users.findAll({
      attributes: ['id', 'username', 'postCount'],
      order: [['postCount', 'DESC']],
      limit: 3,
      include: [{ model: CommentModel, as: 'comments', separate: true, order: [['createdAt', 'DESC']], limit: 1 }],
    });
    return topUsers;
  }

  public async topUsers2() {
    const topUsers = await this.users.findAll({
      attributes: ['id', 'username', 'postCount'],
      order: [['postCount', 'DESC']],
      limit: 3,
    });

    const userIds = topUsers.map(user => user.id);

    const latestComments: Comment[] = await this.comments.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
      },
      include: [{ model: UserModel, attributes: ['username', 'id'], as: 'user' }],
      order: [['createdAt', 'DESC']],
    });

    const userCommentMap = latestComments.reduce((map, comment) => {
      const userId = comment.user.id;
      if (!map[userId]) {
        map[userId] = comment;
      }
      return map;
    }, {});

    const result = topUsers.map(user => ({
      id: user.id,
      username: user.username,
      postCount: user.postCount,
      latestComment: userCommentMap[user.id]?.content || 'No comment',
    }));

    return result;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.users.findAll();
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await this.users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

    const updateUser: User = await this.users.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default UserService;
