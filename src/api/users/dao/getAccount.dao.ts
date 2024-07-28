import { PoolClient } from "pg";
import pool from "../../../common/database/postgre";

export class GetAccountDao {
  userIdx: number;
  userName: string;
  idValue: string;
  pwValue: string;
  email: string;
  birth: Date;
  gender: string;
  roleIdx: number;

  constructor(data: {
    userIdx: number;
    userName: string;
    idValue: string;
    pwValue: string;
    email: string;
    birth: Date;
    gender: string;
    roleIdx: number;
  }) {
    this.userIdx = data.userIdx;
    this.userName = data.userName;
    this.idValue = data.idValue;
    this.pwValue = data.pwValue;
    this.email = data.email;
    this.birth = data.birth;
    this.gender = data.gender;
    this.roleIdx = data.roleIdx;
  }

  static selectById = async (idValue: string, conn: PoolClient) => {
    const duplicatedId = await pool.query(
      `SELECT 1 FROM project.account WHERE id=$1`,
      [idValue]
    );

    const duplicatedIdRows = duplicatedId.rows;

    return duplicatedIdRows.length !== 0 ? duplicatedIdRows[0] : [];
  };

  static selectByEmail = async (email: string, conn: PoolClient) => {
    const duplicatedEmail = await pool.query(
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
      `SELECT idx, name, "roleIdx" FROM project.account WHERE id = $1 AND password = $2`,
      [idValue, pwValue]
    );

    const userRows = user.rows;

    return userRows.length !== 0 ? userRows[0] : [];
  };
}
