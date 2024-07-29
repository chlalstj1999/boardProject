import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class PutUserInfoDto {
  accountIdx: number;
  userName: string;
  email: string;
  gender: string;
  birth: string;

  constructor(data: {
    accountIdx: number;
    userName: string;
    email: string;
    gender: string;
    birth: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.userName = data.userName;
    this.email = data.email;
    this.gender = data.gender;
    this.birth = data.birth;
  }

  static checkSignUpDto(data: PutUserInfoDto) {
    if (!data.userName.match(regx.userNameRegx)) {
      throw new BadRequestException("이름 확인 필요");
    }

    if (!data.email.match(regx.emailRegx)) {
      throw new BadRequestException("email 확인 필요");
    }

    if (!data.gender.match(regx.genderRegx)) {
      throw new BadRequestException("gender 확인 필요");
    }

    if (!data.birth.match(regx.birthRegx)) {
      throw new BadRequestException("birth 확인 필요");
    }
  }
}
