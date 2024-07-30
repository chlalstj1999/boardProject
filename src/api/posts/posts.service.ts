import pool from "../../common/database/postgre";
import { ConflictException } from "../../common/exception/ConflictException";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { CategorysRepository } from "../categorys/categorys.repository";
import { AddPostDto } from "./dto/addPos.dto";
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

      return await PostRepository.addPost(
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
    }
  };
}
