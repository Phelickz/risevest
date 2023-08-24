import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Roles, User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public username: string;
  public role: Roles;
  public online: boolean;
  public lastLogin: Date;
  public logoutTimestamp: Date;
  public id: string;
  public email: string;
  public password: string;
  public postCount: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      online: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      lastLogin: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      logoutTimestamp: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      role: {
        allowNull: false,
        defaultValue: Roles.User,
        type: DataTypes.ENUM(...Object.values(Roles)),
      },
      postCount: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: 'users',
      sequelize,
      indexes: [
        // Define indexes here
        {
          unique: true,
          fields: ['username'], // Index for quick username lookups
        },
        {
          unique: true,
          fields: ['email'], // Index for quick email lookups
        },
        {
          unique: true,
          fields: ['post_count'],
        },
      ],
    },
  );

  return UserModel;
}
