import { Comment } from './comment.interface';
import { Post } from './post.interface';

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  role: Roles;
  online: boolean;
  lastLogin: Date;
  logoutTimestamp: Date;
  postCount: number;
  posts?: Post[];
  comments?: Comment[];
}

export enum Roles {
  User = 'USER',
  Admin = 'ADMIN',
}
