import pool from "../../common/database/postgre";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";
import { PostRepository } from "../posts/posts.repository";
import { CommentRepository } from "./commetns.repository";
import { AddCommentDto } from "./dto/addComment.dto";
import { PutCommentDto } from "./dto/putComment.dto";

export class CommentService {
  static createComment = async (addCommentDto: AddCommentDto) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(addCommentDto.postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      await CommentRepository.addComment(
        {
          accountIdx: addCommentDto.accountIdx,
          postIdx: addCommentDto.postIdx,
          comment: addCommentDto.comment,
        },
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static selectComments = async (postIdx: number) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      return await CommentRepository.getComments(postIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static updateComment = async (putCommentDto: PutCommentDto) => {
    const conn = await pool.connect();

    try {
      const comment = await CommentRepository.isComment(
        putCommentDto.commentIdx,
        conn
      );
      if (comment.length === 0) {
        throw new NotFoundException("해당 댓글이 존재하지 않음");
      }

      const author = comment.accountIdx;
      if (author !== putCommentDto.accountIdx) {
        throw new UnauthorizedException("해당 작성자만 가능");
      }

      await CommentRepository.putComment(
        {
          accountIdx: putCommentDto.accountIdx,
          commentIdx: putCommentDto.commentIdx,
          comment: putCommentDto.comment,
        },
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static deleteComment = async (accountIdx: number, commentIdx: number) => {
    const conn = await pool.connect();

    try {
      const comment = await CommentRepository.isComment(commentIdx, conn);
      if (comment.length === 0) {
        throw new NotFoundException("해당 댓글이 존재하지 않음");
      }

      const author = comment.accountIdx;
      if (author !== accountIdx) {
        throw new UnauthorizedException("해당 작성자만 가능");
      }

      await CommentRepository.deleteComment(commentIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static updateCommentLike = async (accountIdx: number, commentIdx: number) => {
    const conn = await pool.connect();

    try {
      const comment = await CommentRepository.isComment(commentIdx, conn);
      if (comment.length === 0) {
        throw new NotFoundException("해당 댓글이 존재하지 않음");
      }

      const isCommentLike = await CommentRepository.isCommentLike(
        accountIdx,
        commentIdx,
        conn
      );
      if (isCommentLike.length === 0) {
        await CommentRepository.addCommentLike(accountIdx, commentIdx, conn);
      } else {
        await CommentRepository.deleteCommentLike(accountIdx, commentIdx, conn);
      }
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
