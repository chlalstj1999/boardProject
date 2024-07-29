import { PoolClient } from "pg";
import { admin, user } from "../../../common/const/role";
import { PutUserInfoDto } from "../dto/putUserInfo";

export class GetAccountDao {
  static selectById = async (idValue: string, conn: PoolClient) => {
    const duplicatedId = await conn.query(
      `SELECT 1 FROM project.account WHERE id=$1`,
      [idValue]
    );

    const duplicatedIdRows = duplicatedId.rows;

    return duplicatedIdRows.length !== 0 ? duplicatedIdRows[0] : [];
  };

  static selectByEmail = async (email: string, conn: PoolClient) => {
    const duplicatedEmail = await conn.query(
      `SELECT 1 FROM project.account WHERE email=$1`,
      [email]
    );

    const duplicatedEmailRows = duplicatedEmail.rows;

    return duplicatedEmailRows.length !== 0 ? duplicatedEmailRows[0] : [];
  };

  static selectUser = async (
    idValue: string,
    pwValue: string,
    conn: PoolClient
  ) => {
    const user = await conn.query(
      `SELECT idx AS "accountIdx", "roleIdx" FROM project.account WHERE id = $1 AND password = $2`,
      [idValue, pwValue]
    );

    const userRows = user.rows;

    return userRows.length !== 0 ? userRows[0] : [];
  };

  static selectId = async (
    userName: string,
    email: string,
    conn: PoolClient
  ) => {
    const user = await conn.query(
      `SELECT id AS "idValue" FROM project.account WHERE name = $1 AND email = $2`,
      [userName, email]
    );
    const userRows = user.rows;

    return userRows.length !== 0 ? userRows[0] : [];
  };

  static selectPw = async (
    userName: string,
    idValue: string,
    conn: PoolClient
  ) => {
    const user = await conn.query(
      `SELECT password AS "pwValue" FROM project.account WHERE name = $1 AND id = $2`,
      [userName, idValue]
    );
    const userRows = user.rows;

    return userRows.length !== 0 ? userRows[0] : [];
  };

  static selectUsersInfo = async (conn: PoolClient) => {
    const usersInfo = await conn.query(
      `SELECT project.account.idx AS "userIdx", project.account.name AS "userName", project.account.id AS "idValue", project.role.name AS "roleName" FROM project.account JOIN project.role ON project.account."roleIdx" = project.role.idx`
    );

    const usersInfoRows = usersInfo.rows;

    return usersInfoRows.length !== 0 ? usersInfoRows : [];
  };

  static selectUserInfo = async (accountIdx: number, conn: PoolClient) => {
    const userInfo = await conn.query(
      `SELECT name AS "userName", email, gender, birth FROM project.account WHERE idx=$1`,
      [accountIdx]
    );

    const userInfoRows = userInfo.rows;

    return userInfoRows.length !== 0 ? userInfoRows[0] : [];
  };

  static selectUserRole = async (userIdx: number, conn: PoolClient) => {
    const accounts = await conn.query(
      `SELECT "roleIdx" FROM project.account WHERE idx = $1`,
      [userIdx]
    );

    const accountsRow = accounts.rows;

    return accountsRow.length !== 0 ? accountsRow[0] : [];
  };

  static selectByEmailExclusionMe = async (
    putUserInfoDto: PutUserInfoDto,
    conn: PoolClient
  ) => {
    const duplicatedEmail = await conn.query(
      `SELECT 1 FROM project.account WHERE email=$1 AND idx != $2`,
      [putUserInfoDto.email, putUserInfoDto.accountIdx]
    );

    const duplicatedEmailRows = duplicatedEmail.rows;

    return duplicatedEmailRows.length !== 0 ? duplicatedEmailRows[0] : [];
  };
}
