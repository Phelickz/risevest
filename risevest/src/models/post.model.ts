import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Post } from '@interfaces/post.interface';
import { UserModel } from './users.model';

export type PostCreationAttributes = Optional<Post, 'content'>;

export class PostModel extends Model<Post, PostCreationAttributes> implements Post {
  public id: string;
  public title: string;
  public content: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof PostModel {
  PostModel.init(
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
      title: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'posts',
      sequelize,
      indexes: [
        {
          fields: ['user_id'], // Index for foreign key in Post table
        },
      ],
    },
  );

  PostModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' }); // A post belongs to a user
  UserModel.hasMany(PostModel, { foreignKey: 'userId', as: 'posts' }); // A user has many posts

  return PostModel;
}
