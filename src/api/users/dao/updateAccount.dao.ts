import { PoolClient } from "pg";
import { admin, user } from "../../../common/const/role";
import { PutUserInfoDto } from "../dto/putUserInfo";

export class UpdateAccountDao {
  accountIdx: number;
  userName: string;
  email: string;
  birth: string;
  gender: string;

  constructor(data: {
    accountIdx: number;
    userName: string;
    email: string;
    birth: string;
    gender: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.userName = data.userName;
    this.email = data.email;
    this.birth = data.birth;
    this.gender = data.gender;
  }
  static putUserRole = async (
    userRole: number,
    userIdx: number,
    conn: PoolClient
  ) => {
    if (userRole === admin) {
      await conn.query(
        `UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`,
        [user, userIdx]
      );
    } else if (userRole === user) {
      await conn.query(
        `UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`,
        [admin, userIdx]
      );
    }
  };

  static putUserInfo = async (
    UpdateAccountDao: UpdateAccountDao,
    conn: PoolClient
  ) => {
    await conn.query(
      `UPDATE project.account SET name = $1, email = $2, gender = $3, birth = $4 WHERE idx = $5`,
      [
        UpdateAccountDao.userName,
        UpdateAccountDao.email,
        UpdateAccountDao.gender,
        UpdateAccountDao.birth,
        UpdateAccountDao.accountIdx,
      ]
    );
  };
}
