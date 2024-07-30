import { PoolClient } from "pg";
import { InsertCommentDao } from "./dao/insertComment.dao";
import { GetCommentDao } from "./dao/getComment.dao";
import { UpdateCommentDao } from "./dao/updateComment.dao";
import { DeleteCommentDao } from "./dao/deleteComment.dao";

export class CommentRepository {
  static addComment = async (
    insertCommentDao: InsertCommentDao,
    conn: PoolClient
  ) => {
    try {
      await InsertCommentDao.addComment(insertCommentDao, conn);
    } catch (err) {
      throw err;
    }
  };

  static isComment = async (commentIdx: number, conn: PoolClient) => {
    try {
      return await GetCommentDao.isComment(commentIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static getComments = async (postIdx: number, conn: PoolClient) => {
    try {
      return await GetCommentDao.getComments(postIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static putComment = async (
    updateCommentDao: UpdateCommentDao,
    conn: PoolClient
  ) => {
    try {
      await UpdateCommentDao.putComment(updateCommentDao, conn);
    } catch (err) {
      throw err;
    }
  };

  static deleteComment = async (commentIdx: number, conn: PoolClient) => {
    try {
      await DeleteCommentDao.deleteComment(commentIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static isCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    try {
      return await GetCommentDao.getIsCommentLike(accountIdx, commentIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static addCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    try {
      await InsertCommentDao.addCommentLike(accountIdx, commentIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static deleteCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    try {
      await DeleteCommentDao.deleteCommentLike(accountIdx, commentIdx, conn);
    } catch (err) {
      throw err;
    }
  };
}
