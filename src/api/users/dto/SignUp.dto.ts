import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class SignUpDto {
  userName: string;
  idValue: string;
  pwValue: string;
  email: string;
  gender: string;
  birth: Date;

  constructor(data: {
    userName: string;
    idValue: string;
    pwValue: string;
    email: string;
    gender: string;
    birth: Date;
  }) {
    this.userName = data.userName;
    this.idValue = data.idValue;
    this.pwValue = data.pwValue;
    this.email = data.email;
    this.gender = data.gender;
    this.birth = data.birth;
  }

  static createAccountDto(data: any) {
    if (!data.userName.match(regx.userNameRegx)) {
      throw new BadRequestException("이름 확인 필요");
    }

    if (!data.idValue.match(regx.idRegx)) {
      throw new BadRequestException("ID 확인 필요");
    }

    if (!data.pwValue.match(regx.pwRegx)) {
      throw new BadRequestException("password 확인 필요");
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
