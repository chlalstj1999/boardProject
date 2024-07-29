import { Pool, PoolClient } from "pg";
import { InsertAccountDao } from "./dao/insertAccount.dao";
import { GetAccountDao } from "./dao/getAccount.dao";
import { LoginDto } from "./dto/login.dto";
import { FindIdDto } from "./dto/findId.dto";
import { FindPwDto } from "./dto/findPw.dto";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { PutUserInfoDto } from "./dto/putUserInfo";
import { UpdateAccountDao } from "./dao/updateAccount.dao";
import { DeleteAccountDao } from "./dao/deleteAccount.dao";

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

  static getId = async (findIdDto: FindIdDto, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectId(
        findIdDto.userName,
        findIdDto.email,
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getPw = async (findPwDto: FindPwDto, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectPw(
        findPwDto.userName,
        findPwDto.idValue,
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getUsersInfo = async (conn: PoolClient) => {
    try {
      return await GetAccountDao.selectUsersInfo(conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static getUserInfo = async (accountIdx: number, conn: PoolClient) => {
    try {
      return await GetAccountDao.selectUserInfo(accountIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static putUserAuth = async (userIdx: number, conn: PoolClient) => {
    try {
      const userRole = await GetAccountDao.selectUserRole(userIdx, conn);

      if (userRole.length === 0) {
        throw new NotFoundException("userIdx에 해당하는 유저 없음");
      }

      await UpdateAccountDao.putUserRole(userRole.roleIdx, userIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static selectByEmailExclusionMe = async (
    putUserInfoDto: PutUserInfoDto,
    conn: PoolClient
  ) => {
    try {
      return await GetAccountDao.selectByEmailExclusionMe(putUserInfoDto, conn);
    } catch (err) {
      throw err;
    }
  };

  static putUserInfo = async (
    updateAccountDao: UpdateAccountDao,
    conn: PoolClient
  ) => {
    try {
      await UpdateAccountDao.putUserInfo(updateAccountDao, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static deleteUser = async (accountIdx: number, conn: PoolClient) => {
    try {
      await DeleteAccountDao.deleteUser(accountIdx, conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
