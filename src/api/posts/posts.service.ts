import pool from "../../common/database/postgre";
import { ConflictException } from "../../common/exception/ConflictException";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";
import { CategorysRepository } from "../categorys/categorys.repository";
import { AddPostDto } from "./dto/addPost.dto";
import { PutPostDto } from "./dto/putPost.dto";
import { PostRepository } from "./posts.repository";

export class PostService {
  static selectPostLists = async (categoryIdx: number) => {
    const conn = await pool.connect();

    try {
      const category = await CategorysRepository.selectByIdx(categoryIdx, conn);
      if (category.length === 0) {
        throw new NotFoundException("해당 카테고리가 존재하지 않음");
      }

      return await PostRepository.getPostLists(categoryIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static createPost = async (addPostDto: AddPostDto) => {
    const conn = await pool.connect();

    try {
      const category = await CategorysRepository.selectByIdx(
        addPostDto.categoryIdx,
        conn
      );
      if (category.length === 0) {
        throw new NotFoundException("해당 카테고리가 존재하지 않음");
      }

      const post = await PostRepository.getPostByTitle(addPostDto.title, conn);
      if (post.length !== 0) {
        throw new ConflictException("같은 제목이 존재함");
      }

      await PostRepository.addPost(
        {
          accountIdx: addPostDto.accountIdx,
          categoryIdx: addPostDto.categoryIdx,
          title: addPostDto.title,
          content: addPostDto.content,
        },
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static selectPost = async (postIdx: number) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      return await PostRepository.getPost(postIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static updatePost = async (putPostDto: PutPostDto) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(putPostDto.postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      const author = post.accountIdx;
      if (author !== putPostDto.accountIdx) {
        throw new UnauthorizedException("해당 작성자만 가능");
      }

      const postDuplicate = await PostRepository.getPostByTitleExIdx(
        putPostDto.title,
        putPostDto.postIdx,
        conn
      );
      if (postDuplicate.length !== 0) {
        throw new ConflictException("같은 제목이 존재함");
      }

      await PostRepository.putPost(
        {
          accountIdx: putPostDto.accountIdx,
          postIdx: putPostDto.postIdx,
          title: putPostDto.title,
          content: putPostDto.content,
        },
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static deletePost = async (accountIdx: number, postIdx: number) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      const author = post.accountIdx;
      if (author !== accountIdx) {
        throw new UnauthorizedException("해당 작성자만 가능");
      }

      await PostRepository.deletePost(postIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static updatePostLike = async (accountIdx: number, postIdx: number) => {
    const conn = await pool.connect();

    try {
      const post = await PostRepository.isPost(postIdx, conn);
      if (post.length === 0) {
        throw new NotFoundException("해당 게시물이 존재하지 않음");
      }

      const isPostLike = await PostRepository.isPostLike(
        accountIdx,
        postIdx,
        conn
      );
      if (isPostLike.length === 0) {
        await PostRepository.addPostLike(accountIdx, postIdx, conn);
      } else {
        await PostRepository.deletePostLike(accountIdx, postIdx, conn);
      }
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
