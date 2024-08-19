import { Pool } from "pg";
import { CommentRepository } from "./dao/comment.dao";
import { CommentDto } from "./dto/comment.dto";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";
import { PostRepository } from "../posts/dao/post.dao";
import { PostDto } from "../posts/dto/post.dto";

interface IcommentService {
  createComment(commentDto: CommentDto, postDto: PostDto): Promise<void>;
  selectComments(commentDto: CommentDto, postDto: PostDto): Promise<{}[]>;
  updateComment(commentDto: CommentDto): Promise<void>;
  deleteComment(commentDto: CommentDto): Promise<void>;
  updateCommentLike(commentDto: CommentDto): Promise<void>;
}

export class CommentService implements IcommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly pool: Pool
  ) {}

  async createComment(commentDto: CommentDto, postDto: PostDto): Promise<void> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    await this.commentRepository.addComment(commentDto, this.pool);
  }

  async selectComments(
    commentDto: CommentDto,
    postDto: PostDto
  ): Promise<{}[]> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    return await this.commentRepository.getComments(commentDto, this.pool);
  }

  async updateComment(commentDto: CommentDto): Promise<void> {
    await this.commentRepository.isComment(commentDto, this.pool);
    if (typeof commentDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 댓글이 존재하지 않음");
    }

    if (commentDto.accountIdx !== commentDto.authorIdx) {
      throw new UnauthorizedException("해당 작성자만 가능");
    }

    await this.commentRepository.putComment(commentDto, this.pool);
  }

  async deleteComment(commentDto: CommentDto): Promise<void> {
    await this.commentRepository.isComment(commentDto, this.pool);
    if (typeof commentDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 댓글이 존재하지 않음");
    }

    if (commentDto.accountIdx !== commentDto.authorIdx) {
      throw new UnauthorizedException("해당 작성자만 가능");
    }

    await this.commentRepository.deleteComment(commentDto, this.pool);
  }

  async updateCommentLike(commentDto: CommentDto): Promise<void> {
    await this.commentRepository.isComment(commentDto, this.pool);
    if (typeof commentDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 댓글이 존재하지 않음");
    }

    const isCommentLike = await this.commentRepository.getIsCommentLike(
      commentDto,
      this.pool
    );
    if (isCommentLike.length === 0) {
      await this.commentRepository.addCommentLike(commentDto, this.pool);
    } else {
      await this.commentRepository.deleteCommentLike(commentDto, this.pool);
    }
  }
}
