import pool from "../../common/database/postgre";

export class UserRepository {
  static selectById = async (idValue: string) => {
    try {
      const duplicatedId = await pool.query(
        `SELECT 1 FROM project.account WHERE id=$1`,
        [idValue]
      );
      const duplicatedIdRows = duplicatedId.rows;
      return duplicatedIdRows.length !== 0 ? duplicatedIdRows[0] : [];
    } catch (err) {
      throw err;
    }
  };

  static selectByEmail = async (email: string) => {
    try {
      const duplicatedEmail = await pool.query(
        `SELECT 1 FROM project.account WHERE email=$1`,
        [email]
      );

      const duplicatedEmailRows = duplicatedEmail.rows;

      return duplicatedEmailRows.length !== 0 ? duplicatedEmailRows[0] : [];
    } catch (err) {
      throw err;
    }
  };

  static insertUser = async (InsertAccountDao: any) => {
    try {
      await pool.query(
        `INSERT INTO project.account (name, id, password, email, gender, birth, "roleIdx") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          InsertAccountDao.userName,
          InsertAccountDao.idValue,
          InsertAccountDao.pwValue,
          InsertAccountDao.email,
          InsertAccountDao.gender,
          InsertAccountDao.birth,
          InsertAccountDao.roleIdx,
        ]
      );
    } catch (err) {
      throw err;
    }
  };
}
