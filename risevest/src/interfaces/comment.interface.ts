import { User } from './users.interface';

export interface Comment {
  id: string;
  content: string;
  userId?: string;
  user?: User;
}
