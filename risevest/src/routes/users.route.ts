import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware, { masterMiddleware } from '@/middlewares/auth.middleware';
import PostController from '@/controllers/post.controller';
import AuthController from '@/controllers/auth.controller';
import { CreatePostDto } from '@/dtos/post.dto';

class UsersRoute implements Routes {
  public path = '/users/';
  public router = Router();
  public usersController = new UsersController();
  public postController = new PostController();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, masterMiddleware, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);

    this.router.post(
      `${this.path}:id(\\w+-\\w+-\\w+-\\w+-\\w+)/posts`,
      authMiddleware,
      validationMiddleware(CreatePostDto, 'body'),
      this.postController.createPost,
    );
    this.router.get(`${this.path}:id(\\w+-\\w+-\\w+-\\w+-\\w+)/posts`, authMiddleware, this.postController.findUserPost);
    this.router.get(`${this.path}top-users`, authMiddleware, this.usersController.topUsers);
  }
}

export default UsersRoute;

// this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
//     this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
