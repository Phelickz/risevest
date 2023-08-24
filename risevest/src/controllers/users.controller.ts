import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public topUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topUsers = await this.userService.topUsers();
      res.status(200).json(topUsers);
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const findOneUserData: User = await this.userService.findUserById(userId as string);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId as string, userData);

      res.status(200).json(updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.query;
      const deleteUserData: User = await this.userService.deleteUser(userId as string);

      res.status(200).json(deleteUserData);
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
