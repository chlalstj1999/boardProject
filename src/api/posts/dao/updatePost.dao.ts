import { PoolClient } from "pg";

export class UpdatePostDao {
  accountIdx: number;
  postIdx: number;
  title: string;
  content: string;

  constructor(data: {
    accountIdx: number;
    postIdx: number;
    title: string;
    content: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.postIdx = data.postIdx;
    this.title = data.title;
    this.content = data.content;
  }

  static putPost = async (insertPostDao: UpdatePostDao, conn: PoolClient) => {
    await conn.query(
      `UPDATE project.post SET title = $1, content = $2 WHERE idx = $3`,
      [insertPostDao.title, insertPostDao.content, insertPostDao.postIdx]
    );
  };
}
