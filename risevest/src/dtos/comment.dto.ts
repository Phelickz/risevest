import { Allow, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  public content: string;

  @Allow()
  public postId: string;

  @Allow()
  public userId: string;
}
