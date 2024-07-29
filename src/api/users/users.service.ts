import { UserRepository } from "./users.repository";
import pool from "../../common/database/postgre";
import { SignUpDto } from "./dto/SignUp.dto";
import { LoginDto } from "./dto/login.dto";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { ConflictException } from "../../common/exception/ConflictException";
import { FindIdDto } from "./dto/findId.dto";
import { FindPwDto } from "./dto/findPw.dto";
import { PutUserInfoDto } from "./dto/putUserInfo";

export class UserService {
  static createUser = async (signUpDto: SignUpDto) => {
    try {
      const conn = await pool.connect();

      const idDuplicateUser = await UserRepository.selectById(
        signUpDto.idValue,
        conn
      );
      if (idDuplicateUser.length !== 0) {
        throw new ConflictException("id 중복");
      }

      const emailDuplicateUser = await UserRepository.selectByEmail(
        signUpDto.email,
        conn
      );
      if (emailDuplicateUser.length !== 0) {
        throw new ConflictException("email 중복");
      }

      await UserRepository.insertUser(
        {
          userName: signUpDto.userName,
          idValue: signUpDto.idValue,
          pwValue: signUpDto.pwValue,
          email: signUpDto.email,
          birth: signUpDto.birth,
          gender: signUpDto.gender,
          roleIdx: 2,
        },
        conn
      );
    } catch (err) {
      throw err;
    }
  };

  static selectUser = async (loginDto: LoginDto) => {
    try {
      const conn = await pool.connect();
      const user = await UserRepository.getUser(loginDto, conn);

      if (user.length === 0) {
        throw new NotFoundException("계정을 찾지 못했습니다.");
      }

      return user;
    } catch (err) {
      throw err;
    }
  };

  static selectId = async (findIdDto: FindIdDto) => {
    try {
      const conn = await pool.connect();
      const user = await UserRepository.getId(findIdDto, conn);

      if (user.length === 0) {
        throw new NotFoundException("계정을 찾지 못했습니다.");
      }

      return user;
    } catch (err) {
      throw err;
    }
  };

  static selectPw = async (findPwDto: FindPwDto) => {
    try {
      const conn = await pool.connect();
      const user = await UserRepository.getPw(findPwDto, conn);

      if (user.length === 0) {
        throw new NotFoundException("계정을 찾지 못했습니다.");
      }

      return user;
    } catch (err) {
      throw err;
    }
  };

  static selectUsersInfo = async () => {
    try {
      const conn = await pool.connect();

      return await UserRepository.getUsersInfo(conn);
    } catch (err) {
      throw err;
    }
  };

  static selectUserInfo = async (accountIdx: number) => {
    try {
      const conn = await pool.connect();

      return await UserRepository.getUserInfo(accountIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static updateAuth = async (userIdx: number) => {
    try {
      const conn = await pool.connect();

      await UserRepository.putUserAuth(userIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static updatUserInfo = async (putUserInfoDto: PutUserInfoDto) => {
    try {
      const conn = await pool.connect();

      const emailDuplicateUser = await UserRepository.selectByEmailExclusionMe(
        putUserInfoDto,
        conn
      );

      if (emailDuplicateUser.length !== 0) {
        throw new ConflictException("email 중복");
      }

      await UserRepository.putUserInfo(
        {
          accountIdx: putUserInfoDto.accountIdx,
          userName: putUserInfoDto.userName,
          email: putUserInfoDto.email,
          birth: putUserInfoDto.birth,
          gender: putUserInfoDto.gender,
        },
        conn
      );
    } catch (err) {
      throw err;
    }
  };

  static deleteUser = async (accountIdx: number) => {
    try {
      const conn = await pool.connect();

      await UserRepository.deleteUser(accountIdx, conn);
    } catch (err) {
      throw err;
    }
  };
}
