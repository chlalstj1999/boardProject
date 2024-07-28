import { UserRepository } from "./users.repository";
import pool from "../../common/database/postgre";
import { SignUpDto } from "./dto/SignUp.dto";
import { LoginDto } from "./dto/login.dto";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { ConflictException } from "../../common/exception/ConflictException";

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
}
