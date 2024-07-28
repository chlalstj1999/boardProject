import { DuplicateException } from "./exception/DuplicatedException";
import { UserRepository } from "./users.repository";

export class UserService {
  static createUser = async (signUpDto: any) => {
    try {
      const idDuplicateUser = await UserRepository.selectById(
        signUpDto.idValue
      );
      if (idDuplicateUser.length !== 0) {
        throw new DuplicateException("id 중복");
      }

      const emailDuplicateUser = await UserRepository.selectByEmail(
        signUpDto.email
      );
      if (emailDuplicateUser.length !== 0) {
        throw new DuplicateException("email 중복");
      }

      await UserRepository.insertUser({
        userName: signUpDto.userName,
        idValue: signUpDto.idValue,
        pwValue: signUpDto.pwValue,
        email: signUpDto.email,
        birth: signUpDto.birth,
        gender: signUpDto.gender,
        roleIdx: 2,
      });
    } catch (err) {
      throw err;
    }
  };
}
