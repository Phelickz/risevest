import bcrypt from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { CreatePostDto } from '@dtos/post.dto';
import UsersRoute from '@routes/users.route';
import { faker } from '@faker-js/faker';
import { Roles, User } from '@/interfaces/users.interface';
import { Request, Response, NextFunction } from 'express';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Users ROUTE', () => {
  describe('[POST] /users', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
        role: Roles.User,
      };

      const userRoute = new UsersRoute();
      const users = userRoute.authController.authService.users;
      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        id: faker.datatype.uuid(), //sadsds
        email: userData.email,
        username: userData.username,
        password: await bcrypt.hash(userData.password, 10),
      });

      // Mock the login function since we want to test signup only
      userRoute.authController.authService.login = jest.fn().mockResolvedValue({
        user: {
          ...userData,
          id: faker.datatype.uuid(),
        },
        token: 'mockToken',
        cookie: 'mockCookie',
      });

      const result = await userRoute.authController.authService.signup(userData);

      expect(result.user).toBeDefined();
      expect(result.token).toBe('mockToken');
      expect(result.cookie).toBe('mockCookie');
    });
  });

  describe('[GET] /users', () => {
    it('should return a list of users', async () => {
      const userRoute = new UsersRoute();
      // Mock the findAllUser function to return fake user data
      userRoute.usersController.userService.findAllUser = jest.fn().mockResolvedValue([
        { id: '1', username: 'user1', email: 'user1@example.com' },
        { id: '2', username: 'user2', email: 'user2@example.com' },
        // Add more user data as needed
      ] as User[]);

      const req: Partial<Request> = {}; // Mock the Request object
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }; // Mock the Response object
      const next: NextFunction = jest.fn(); // Mock the NextFunction

      await userRoute.usersController.getUsers(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', username: 'user1', email: 'user1@example.com' },
        { id: '2', username: 'user2', email: 'user2@example.com' },
      ]);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('[POST] /users/:id/posts', () => {
    it('should create a new post', async () => {
      const userRoute = new UsersRoute();
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post.',
        userId: 'user-id-here',
      };

      const mockCreatedPost = {
        id: 'post-id',
        title: createPostDto.title,
        content: createPostDto.content,
        userId: createPostDto.userId,
      };

      userRoute.postController.postService.createPost = jest.fn().mockResolvedValue(mockCreatedPost);

      const req: Partial<Request> = {
        params: {
          id: 'user-id-here', // Assuming this is the user ID
        },
        body: createPostDto,
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      await userRoute.postController.createPost(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedPost);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('[GET] /users/:id/posts', () => {
    it('should return posts for a user', async () => {
      const userRoute = new UsersRoute();
      const userId = 'user-id-here';
      const mockUserPosts = [
        {
          id: 'post-1-id',
          title: 'Post 1',
          content: 'This is post 1.',
          userId: userId,
          comments: [], // Assuming comments are an empty array here
        },
        {
          id: 'post-2-id',
          title: 'Post 2',
          content: 'This is post 2.',
          userId: userId,
          comments: [],
        },
      ];

      userRoute.postController.postService.findUserPost = jest.fn().mockResolvedValue(mockUserPosts);

      const req: Partial<Request> = {
        params: {
          id: userId,
        },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      await userRoute.postController.findUserPost(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUserPosts);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('[GET] /users/top-users', () => {
    it('should return top users with their data', async () => {
      const userRoute = new UsersRoute();
      const mockTopUsers = [
        {
          id: 'user-1-id',
          username: 'user1',
          postCount: 10,
          comments: [
            {
              id: 'comment-1-id',
              content: 'Comment 1',
              userId: 'user-1-id',
            },
          ],
        },
        {
          id: 'user-2-id',
          username: 'user2',
          postCount: 8,
          comments: [
            {
              id: 'comment-2-id',
              content: 'Comment 2',
              userId: 'user-2-id',
            },
          ],
        },
      ];

      userRoute.usersController.userService.topUsers = jest.fn().mockResolvedValue(mockTopUsers);

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next: NextFunction = jest.fn();

      await userRoute.usersController.topUsers(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTopUsers);
      expect(next).not.toHaveBeenCalled();
    });

    // Add more test cases to cover error scenarios
  });
});
