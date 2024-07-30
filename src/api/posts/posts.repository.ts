import { PoolClient } from "pg";
import { GetPostDao } from "./dao/getPost.dao";
import { InsertPostDao } from "./dao/insertPost.dao";

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
      return await InsertPostDao.addPost(insertPostDao, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
