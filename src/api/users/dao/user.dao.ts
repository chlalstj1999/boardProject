import { Pool } from "pg";
import { UserDto } from "../dto/user.dto";
import { admin, user } from "../../../common/const/role";

interface IuserRepository {
  createAccount(userDto: UserDto, conn: Pool): Promise<void>;
  selectById(userDto: UserDto, conn: Pool): Promise<any[]>;
  selectByEmail(userDto: UserDto, conn: Pool): Promise<any[]>;
  selectUser(userDto: UserDto, conn: Pool): Promise<UserDto>;
  selectId(userDto: UserDto, conn: Pool): Promise<UserDto>;
  selectPw(userDto: UserDto, conn: Pool): Promise<UserDto>;
  selectUsersInfo(conn: Pool): Promise<UserDto[]>;
  selectUserInfo(userDto: UserDto, conn: Pool): Promise<UserDto>;
  selectUserRole(userDto: UserDto, conn: Pool): Promise<UserDto>;
  selectByEmailExclusionMe(userDto: UserDto, conn: Pool): Promise<any>;
  putUserRole(userDto: UserDto, conn: Pool): Promise<void>;
  putUserInfo(userDto: UserDto, conn: Pool): Promise<void>;
  deleteUser(userDto: UserDto, conn: Pool): Promise<void>;
}

export class UserRepository implements IuserRepository {
  constructor(private readonly pool: Pool) {}

  async createAccount(userDto: UserDto, conn: Pool = this.pool): Promise<void> {
    await conn.query(
      `INSERT INTO project.account (name, id, password, email, gender, birth, "roleIdx") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userDto.userName,
        userDto.idValue,
        userDto.pwValue,
        userDto.email,
        userDto.gender,
        userDto.birth,
        userDto.roleIdx,
      ]
    );
  }

  async selectById(userDto: UserDto, conn: Pool = this.pool): Promise<any[]> {
    const duplicatedIdQueryResult = await conn.query(
      `SELECT 1 FROM project.account WHERE id=$1`,
      [userDto.idValue]
    );

    return duplicatedIdQueryResult.rows;
  }

  async selectByEmail(
    userDto: UserDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const duplicatedEmailQueryResult = await conn.query(
      `SELECT 1 FROM project.account WHERE email=$1`,
      [userDto.email]
    );

    return duplicatedEmailQueryResult.rows;
  }

  async selectUser(userDto: UserDto, conn: Pool = this.pool): Promise<UserDto> {
    const userQueryResult = await conn.query(
      `SELECT idx AS "accountIdx", "roleIdx" FROM project.account WHERE id = $1 AND password = $2`,
      [userDto.idValue, userDto.pwValue]
    );

    if (userQueryResult.rows.length !== 0) {
      userDto.accountIdx = userQueryResult.rows[0].accountIdx;
      userDto.roleIdx = userQueryResult.rows[0].roleIdx;
    }

    return userDto;
  }

  async selectId(userDto: UserDto, conn: Pool = this.pool): Promise<UserDto> {
    const userQueryResult = await conn.query(
      `SELECT id AS "idValue" FROM project.account WHERE name = $1 AND email = $2`,
      [userDto.userName, userDto.email]
    );

    if (userQueryResult.rows.length !== 0) {
      userDto.idValue = userQueryResult.rows[0].idValue;
    }

    return userDto;
  }

  async selectPw(userDto: UserDto, conn: Pool = this.pool): Promise<UserDto> {
    const userQueryResult = await conn.query(
      `SELECT password AS "pwValue" FROM project.account WHERE name = $1 AND id = $2`,
      [userDto.userName, userDto.idValue]
    );

    if (userQueryResult.rows.length !== 0) {
      userDto.pwValue = userQueryResult.rows[0].pwValue;
    }

    return userDto;
  }

  async selectUsersInfo(conn: Pool = this.pool): Promise<UserDto[]> {
    const usersInfoQueryResult = await conn.query(
      `SELECT project.account.idx AS "userIdx", project.account.name AS "userName", project.account.id AS "idValue", project.role.name AS "roleName" FROM project.account JOIN project.role ON project.account."roleIdx" = project.role.idx`
    );

    return new UserDto().getUsersInfoDto(usersInfoQueryResult.rows);
  }

  async selectUserInfo(
    userDto: UserDto,
    conn: Pool = this.pool
  ): Promise<UserDto> {
    const usersInfoQueryResult = await conn.query(
      `SELECT name AS "userName", email, gender, birth FROM project.account WHERE idx=$1`,
      [userDto.accountIdx]
    );

    if (usersInfoQueryResult.rows.length !== 0) {
      userDto.userName = usersInfoQueryResult.rows[0].userName;
      userDto.email = usersInfoQueryResult.rows[0].email;
      userDto.gender = usersInfoQueryResult.rows[0].gender;
      userDto.birth = usersInfoQueryResult.rows[0].birth;
    }

    return userDto;
  }

  async selectUserRole(
    userDto: UserDto,
    conn: Pool = this.pool
  ): Promise<UserDto> {
    const accountsQueryResult = await conn.query(
      `SELECT "roleIdx" FROM project.account WHERE idx = $1`,
      [userDto.userIdx]
    );

    if (accountsQueryResult.rows.length !== 0) {
      userDto.roleIdx = accountsQueryResult.rows[0].roleIdx;
    }

    return userDto;
  }

  async selectByEmailExclusionMe(
    userDto: UserDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const duplicatedEmailQueryResult = await conn.query(
      `SELECT 1 FROM project.account WHERE email=$1 AND idx != $2`,
      [userDto.email, userDto.accountIdx]
    );

    return duplicatedEmailQueryResult.rows;
  }

  async putUserRole(userDto: UserDto, conn: Pool = this.pool): Promise<void> {
    if (userDto.roleIdx === admin) {
      await conn.query(
        `UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`,
        [user, userDto.userIdx]
      );
    } else if (userDto.roleIdx === user) {
      await conn.query(
        `UPDATE project.account SET "roleIdx" = $1 WHERE idx = $2`,
        [admin, userDto.userIdx]
      );
    }
  }

  async putUserInfo(userDto: UserDto, conn: Pool = this.pool): Promise<void> {
    await conn.query(
      `UPDATE project.account SET name = $1, email = $2, gender = $3, birth = $4 WHERE idx = $5`,
      [
        userDto.userName,
        userDto.email,
        userDto.gender,
        userDto.birth,
        userDto.accountIdx,
      ]
    );
  }

  async deleteUser(userDto: UserDto, conn: Pool = this.pool): Promise<void> {
    await conn.query(`DELETE FROM project.account WHERE idx = $1`, [
      userDto.accountIdx,
    ]);
  }
}
