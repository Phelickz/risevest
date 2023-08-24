import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Comment } from '@interfaces/comment.interface';
import { UserModel } from './users.model';
import { PostModel } from './post.model';

export type CommentCreationAttributes = Optional<Comment, 'content'>;

export class CommentModel extends Model<Comment, CommentCreationAttributes> implements Comment {
  public id: string;
  public content: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CommentModel {
  CommentModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'comments',
      sequelize,
      indexes: [
        {
          fields: ['user_id', 'post_id', 'created_at'], // Index for foreign keys in Comment table
        },
      ],
    },
  );

  CommentModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' }); // A comment belongs to a user
  CommentModel.belongsTo(PostModel, { foreignKey: 'postId' }); // A comment belongs to a post
  UserModel.hasMany(CommentModel, { foreignKey: 'userId', as: 'comments' }); // A user has many comments
  PostModel.hasMany(CommentModel, { foreignKey: 'postId', as: 'comments' }); // A post has many comments

  return CommentModel;
}
