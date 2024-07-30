import { PoolClient } from "pg";

export class GetPostDao {
  static getPostLists = async (categoryIdx: number, conn: PoolClient) => {
    const posts = await conn.query(
      `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post."createdAt" 
        FROM project.post 
        JOIN project.account ON "accountIdx" = account.idx 
        WHERE "categoryIdx" = $1 
        ORDER BY post."createdAt" DESC`,
      [categoryIdx]
    );

    const postsRows = posts.rows;

    return postsRows.length !== 0 ? postsRows : [];
  };

  static getPostByTitle = async (title: string, conn: PoolClient) => {
    const post = await conn.query(
      `SELECT 1 FROM project.post WHERE title = $1`,
      [title]
    );
    const postRows = post.rows;

    return postRows.length !== 0 ? postRows[0] : [];
  };

  static isPost = async (postIdx: number, conn: PoolClient) => {
    const post = await conn.query(
      `SELECT idx, "accountIdx" FROM project.post WHERE idx = $1`,
      [postIdx]
    );
    const postRows = post.rows;

    return postRows.length !== 0 ? postRows[0] : [];
  };

  static getPost = async (postIdx: number, conn: PoolClient) => {
    const post = await conn.query(
      `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post.content, post."createdAt", post."countLike" AS "cntPostLike"
      FROM project.post 
      JOIN project.account ON post."accountIdx" = account.idx 
      WHERE post.idx = $1`,
      [postIdx]
    );
    const postRows = post.rows;

    return postRows.length !== 0 ? postRows[0] : [];
  };

  static getPostByTitleExIdx = async (
    title: string,
    postIdx: number,
    conn: PoolClient
  ) => {
    const post = await conn.query(
      `SELECT 1 FROM project.post WHERE title = $1 AND idx != $2`,
      [title, postIdx]
    );
    const postRows = post.rows;

    return postRows.length !== 0 ? postRows[0] : [];
  };

  static getIsPostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    const postLike = await conn.query(
      `SELECT * FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`,
      [postIdx, accountIdx]
    );
    const postLikeRows = postLike.rows;

    return postLikeRows.length !== 0 ? postLikeRows[0] : [];
  };
}
