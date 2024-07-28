import { PoolClient } from "pg";
import pool from "../../../common/database/postgre";

export class InsertAccountDao {
  userName: string;
  idValue: string;
  pwValue: string;
  email: string;
  birth: Date;
  gender: string;
  roleIdx: number;

  constructor(data: {
    userName: string;
    idValue: string;
    pwValue: string;
    email: string;
    birth: Date;
    gender: string;
    roleIdx: number;
  }) {
    this.userName = data.userName;
    this.idValue = data.idValue;
    this.pwValue = data.pwValue;
    this.email = data.email;
    this.birth = data.birth;
    this.gender = data.gender;
    this.roleIdx = data.roleIdx;
  }

  static createAccount = async (
    insertAccountDao: InsertAccountDao,
    conn: PoolClient
  ) => {
    await pool.query(
      `INSERT INTO project.account (name, id, password, email, gender, birth, "roleIdx") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        insertAccountDao.userName,
        insertAccountDao.idValue,
        insertAccountDao.pwValue,
        insertAccountDao.email,
        insertAccountDao.gender,
        insertAccountDao.birth,
        insertAccountDao.roleIdx,
      ]
    );
  };
}
