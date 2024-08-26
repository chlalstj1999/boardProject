import { Pool } from "pg";
import { ConflictException } from "../../common/exception/ConflictException";
import { UserRepository } from "./dao/user.dao";
import { UserDto } from "./dto/user.dto";
import { NotFoundException } from "../../common/exception/NotFoundException";

interface IuserService {
  createUser(userDto: UserDto): Promise<void>;
  createUserByOauth(userDto: UserDto): Promise<void>;
  selectUser(userDto: UserDto): Promise<UserDto>;
  selectId(userDto: UserDto): Promise<UserDto>;
  selectPw(userDto: UserDto): Promise<UserDto>;
  selectUsersInfo(): Promise<{}[]>;
  selectUserInfo(userDto: UserDto): Promise<{}>;
  updateAuth(userDto: UserDto): Promise<void>;
  updatUserInfo(userDto: UserDto): Promise<void>;
  deleteUser(userDto: UserDto): Promise<void>;
}

export class UserService implements IuserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly pool: Pool
  ) {}

  async createUser(userDto: UserDto): Promise<void> {
    const idDuplicateUser = await this.userRepository.selectById(
      userDto,
      this.pool
    );
    if (idDuplicateUser.length !== 0) {
      throw new ConflictException("id 중복");
    }

    const emailDuplicateUser = await this.userRepository.selectByEmail(
      userDto,
      this.pool
    );
    if (emailDuplicateUser.length !== 0) {
      throw new ConflictException("email 중복");
    }

    await this.userRepository.createAccount(userDto, this.pool);
  }

  async createUserByOauth(userDto: UserDto): Promise<void> {
    await this.userRepository.createAccountByOauth(userDto, this.pool);
  }

  async selectUser(userDto: UserDto): Promise<UserDto> {
    await this.userRepository.selectUser(userDto, this.pool);

    if (typeof userDto.accountIdx === "undefined") {
      throw new NotFoundException("계정을 찾지 못했습니다.");
    }

    return userDto;
  }

  async selectId(userDto: UserDto): Promise<UserDto> {
    await this.userRepository.selectId(userDto, this.pool);

    if (typeof userDto.idValue === "undefined") {
      throw new NotFoundException("계정을 찾지 못했습니다.");
    }

    return userDto;
  }

  async selectPw(userDto: UserDto): Promise<UserDto> {
    await this.userRepository.selectPw(userDto, this.pool);

    if (typeof userDto.pwValue === "undefined") {
      throw new NotFoundException("계정을 찾지 못했습니다.");
    }

    return userDto;
  }

  async selectUsersInfo(): Promise<{}[]> {
    return await this.userRepository.selectUsersInfo(this.pool);
  }

  async selectUserInfo(userDto: UserDto): Promise<{}> {
    return await this.userRepository.selectUserInfo(userDto, this.pool);
  }

  async updateAuth(userDto: UserDto): Promise<void> {
    await this.userRepository.putUserRole(userDto, this.pool);
  }

  async updatUserInfo(userDto: UserDto): Promise<void> {
    const emailDuplicateUser =
      await this.userRepository.selectByEmailExclusionMe(userDto, this.pool);

    if (emailDuplicateUser.length !== 0) {
      throw new ConflictException("email 중복");
    }

    await this.userRepository.putUserInfo(userDto, this.pool);
  }

  async deleteUser(userDto: UserDto): Promise<void> {
    await this.userRepository.deleteUser(userDto, this.pool);
  }

  async selectUserByEmail(userDto: UserDto): Promise<UserDto> {
    const isUser = await this.userRepository.selectByEmail(userDto, this.pool);

    if (isUser.length !== 0) {
      userDto.accountIdx = isUser[0].accountIdx;
      userDto.roleIdx = isUser[0].roleIdx;
    }

    return userDto;
  }
}
