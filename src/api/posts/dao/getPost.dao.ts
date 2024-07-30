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
      `SELECT * FROM project.post WHERE title = ?`,
      [title]
    );
    const postRows = post.rows;

    return postRows[0].length !== 0 ? postRows[0] : [];
  };
}
