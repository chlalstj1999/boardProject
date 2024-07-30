import { PoolClient } from "pg";

export class UpdateCommentDao {
  accountIdx: number;
  commentIdx: number;
  comment: string;

  constructor(data: {
    accountIdx: number;
    commentIdx: number;
    comment: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.commentIdx = data.commentIdx;
    this.comment = data.comment;
  }

  static putComment = async (
    updateCommentDao: UpdateCommentDao,
    conn: PoolClient
  ) => {
    await conn.query(`UPDATE project.comment SET content = $1 WHERE idx = $2`, [
      updateCommentDao.comment,
      updateCommentDao.commentIdx,
    ]);
  };
}
