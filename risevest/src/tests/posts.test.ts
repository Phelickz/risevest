import { CreateCommentDto } from '@dtos/comment.dto';
import PostRoute from '@routes/post.route';
import { Request, Response, NextFunction } from 'express';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('POST ROUTE', () => {
  describe('[POST] /posts/:id(\\w+-\\w+-\\w+-\\w+-\\w+)/comment`', () => {
    it('should create a new comment', async () => {
      const postRoute = new PostRoute();
      const mockUser = { id: '1', username: 'user1', email: 'user1@example.com' };
      const createCommentDto: CreateCommentDto = {
        content: 'This is a test comment.',
        postId: 'post-id-here',
        userId: '123-4-122',
      };

      const mockCreatedComment = {
        id: 'comment-id',
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        userId: 'user-id-associated-with-post',
      };

      postRoute.commentController.commentService.createComment = jest.fn().mockResolvedValue(mockCreatedComment);

      const req: Partial<Request> = {
        params: {
          id: 'post-id-here',
        },
        body: createCommentDto,
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: {
          user: mockUser, // Mock the user property in res.locals
        },
      };

      const next: NextFunction = jest.fn();

      await postRoute.commentController.createComment(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedComment);
      expect(next).not.toHaveBeenCalled();
    });

    // Add more test cases to cover error scenarios
  });
});
