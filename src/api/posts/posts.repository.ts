import { PoolClient } from "pg";
import { GetPostDao } from "./dao/getPost.dao";
import { InsertPostDao } from "./dao/insertPost.dao";
import { UpdatePostDao } from "./dao/updatePost.dao";
import { DeletePostDao } from "./dao/deletePost.dao";

export class PostRepository {
  static getPostLists = async (categoryIdx: number, conn: PoolClient) => {
    try {
      return await GetPostDao.getPostLists(categoryIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getPostByTitle = async (title: string, conn: PoolClient) => {
    try {
      return await GetPostDao.getPostByTitle(title, conn);
    } catch (err) {
      throw err;
    }
  };

  static addPost = async (insertPostDao: InsertPostDao, conn: PoolClient) => {
    try {
      console.log(insertPostDao);
      return await InsertPostDao.addPost(insertPostDao, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static isPost = async (postIdx: number, conn: PoolClient) => {
    try {
      return await GetPostDao.isPost(postIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static getPost = async (postIdx: number, conn: PoolClient) => {
    try {
      return await GetPostDao.getPost(postIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static putPost = async (updatePostDao: UpdatePostDao, conn: PoolClient) => {
    try {
      await UpdatePostDao.putPost(updatePostDao, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getPostByTitleExIdx = async (
    title: string,
    postIdx: number,
    conn: PoolClient
  ) => {
    try {
      return await GetPostDao.getPostByTitleExIdx(title, postIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static deletePost = async (postIdx: number, conn: PoolClient) => {
    try {
      await DeletePostDao.deletePost(postIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static isPostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    try {
      return await GetPostDao.getIsPostLike(accountIdx, postIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static addPostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    try {
      return await InsertPostDao.addPostLike(accountIdx, postIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static deletePostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    try {
      return await DeletePostDao.deletePostLike(accountIdx, postIdx, conn);
    } catch (err) {
      throw err;
    }
  };
}
