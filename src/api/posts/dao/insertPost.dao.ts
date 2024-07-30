import { PoolClient } from "pg";

export class InsertPostDao {
  accountIdx: number;
  categoryIdx: number;
  title: string;
  content: string;

  constructor(data: {
    accountIdx: number;
    categoryIdx: number;
    title: string;
    content: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.categoryIdx = data.categoryIdx;
    this.title = data.title;
    this.content = data.content;
  }

  static addPost = async (insertPostDao: InsertPostDao, conn: PoolClient) => {
    await conn.query(
      `INSERT INTO project.post ("accountIdx", title, content, "categoryIdx", "countLike") VALUES ($1, $2, $3, $4, $5)`,
      [
        insertPostDao.accountIdx,
        insertPostDao.title,
        insertPostDao.content,
        insertPostDao.categoryIdx,
        0,
      ]
    );
  };

  static addPostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    await conn.query(`BEGIN`);
    await conn.query(
      `INSERT INTO project."postLike" ("postIdx", "accountIdx") VALUES ($1, $2)`,
      [postIdx, accountIdx]
    );
    await conn.query(
      `UPDATE project.post SET "countLike" = (
        SELECT COUNT(*)
        FROM project."postLike" 
        JOIN project.post ON "postLike"."postIdx" = post.idx
        ) WHERE idx = $1`,
      [postIdx]
    );
    await conn.query(`COMMIT`);
  };
}
