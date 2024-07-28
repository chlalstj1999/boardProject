import { PoolClient } from "pg";
import pool from "../../common/database/postgre";
import { InsertAccountDao } from "./dao/insertAccount.dao";
import { GetAccountDao } from "./dao/getAccount.dao";
import { LoginDto } from "./dto/login.dto";

export class UserRepository {
  static selectById = async (idValue: string, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectById(idValue, conn);
    } catch (err) {
      throw err;
    }
  };

  static selectByEmail = async (email: string, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectByEmail(email, conn);
    } catch (err) {
      throw err;
    }
  };

  static insertUser = async (
    insertAccountDao: InsertAccountDao,
    conn: PoolClient
  ) => {
    try {
      await InsertAccountDao.createAccount(insertAccountDao, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getUser = async (loginDto: LoginDto, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectUser(
        loginDto.idValue,
        loginDto.pwValue,
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
