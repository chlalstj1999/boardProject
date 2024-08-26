interface IuserDto {
  accountIdx?: number;
  userIdx?: number;
  userName?: string;
  idValue?: string;
  pwValue?: string;
  email?: string;
  birth?: string;
  gender?: string;
  roleName?: string;
  roleIdx?: number;
  signUpPath?: string;
}

interface IuserResponseDto {
  getUsersInfoDto(
    data: {
      userIdx: number;
      userName: string;
      idValue: string;
      roleName: string;
    }[]
  ): UserDto[];
}

export class UserDto implements IuserDto, IuserResponseDto {
  accountIdx?: number;
  userIdx?: number;
  userName?: string;
  idValue?: string;
  pwValue?: string;
  email?: string;
  birth?: string;
  gender?: string;
  roleName?: string;
  roleIdx?: number;
  signUpPath?: string;

  constructor(data?: Partial<IuserDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getUsersInfoDto(
    data: {
      userIdx: number;
      userName: string;
      idValue: string;
      roleName: string;
    }[]
  ): UserDto[] {
    return data.map((item) => {
      const userDto = new UserDto();
      userDto.userIdx = item.userIdx;
      userDto.userName = item.userName;
      userDto.idValue = item.idValue;
      userDto.roleName = item.roleName;
      return userDto;
    });
  }
}
